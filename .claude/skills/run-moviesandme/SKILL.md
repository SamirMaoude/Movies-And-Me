---
name: run-moviesandme
description: Run, start, build, launch, screenshot or drive the MoviesAndMe React Native app on the Android emulator (Windows / Git Bash) - boot emulator, start Metro, gradle installDebug, search a film, tap UI elements by text, read JS logs.
---

# Run MoviesAndMe (Android, Windows)

React Native 0.83 app (package `com.protosol.moviesandme`) that searches films via TMDB.
It is driven through `adb` by `driver.sh`, a Git Bash script that boots the emulator,
starts Metro, builds/installs, taps UI nodes found via `uiautomator dump`, and screenshots.
Paths are relative to the repo root. Verified on Windows 11, emulator AVD `Medium_Phone_API_35`.

## Prerequisites

- Android SDK at `%LOCALAPPDATA%\Android\Sdk` (or `ANDROID_HOME`), with an AVD named
  `Medium_Phone_API_35` (override with `AVD=<name>`). JDK 17, Node >= 20.
- `npm install` done (`node_modules/` present).
- Run the driver from the **Bash tool (Git Bash)**, not PowerShell.

## Run (agent path)

```bash
D=.claude/skills/run-moviesandme/driver.sh
bash $D up                 # emulator (cold boot if needed) + Metro on 8081 + adb reverse  (~20-60s)
bash $D build              # gradle installDebug, x86_64 only (~2.5 min first time, ~20-40s after)
bash $D launch             # (re)start app, wait for search screen; auto-builds if APK missing
bash $D search "Matrix"    # type in field, press RECHERCHER, screenshot -> prints .png path
bash $D tap-text "Matrix Reloaded"   # open a result (matches text/content-desc substring)
bash $D ss detail          # screenshot -> %TEMP%\moviesandme-run\detail.png (Windows path printed)
bash $D ui                 # list visible texts + bounds (to find what to tap)
bash $D logs               # ReactNativeJS / crash lines from logcat
bash $D down               # stop Metro + emulator
```

Also: `type <text>` (first EditText), `tap <x> <y>` (device px, screen is 1080x2400).
Open the printed `.png` path with the Read tool and **look at it**: a dark screen with
the film-reel logo means the app is stuck on the bootsplash (JS not loaded).

After editing JS: `bash $D launch` restarts the app on the fresh bundle.
After editing native code / adding a native dependency: `bash $D build` then `launch`.

## Run (human path)

```powershell
npx react-native start                       # terminal 1
cd android; .\gradlew.bat app:installDebug   # terminal 2 (emulator already running)
```
`npx react-native run-android` fails in this environment (see Gotchas).

## Test

`npx jest` currently **fails** before running any test:
`TurboModuleRegistry.getEnforcing(...): 'RNBootSplash' could not be found` - App.tsx imports
`react-native-bootsplash` and there is no jest mock for it. Pre-existing; not an env issue.

## Gotchas

- **`npx react-native run-android` -> `'gradlew.bat' n'est pas reconnu`.** The machine sets
  `NoDefaultCurrentDirectoryInExePath=1`, so cmd won't run `gradlew.bat` from the cwd.
  The driver calls `./gradlew.bat` explicitly.
- **Stale autolinking cache -> every native lib fails with "No matching variant ... No variants
  exist".** `android/build/generated/autolinking/autolinking.json` had `"root": "R:\\"` (built
  earlier from a `subst` drive). `build` detects a root mismatch and deletes that folder.
- **Emulator stuck `offline`** when restored from the `default_boot` snapshot. `up` always
  cold-boots (`-no-snapshot-load`) and kills an offline instance first.
- **`emu kill` can lose the installed APK** (userdata not flushed). `launch` checks
  `pm list packages` and rebuilds if missing.
- **First launch right after cold boot can hang on the bootsplash** even though Metro serves the
  bundle. A second launch works; `launch` retries once automatically.
- **Git Bash rewrites `/sdcard/ui.xml` to `C:/Program Files/Git/sdcard/...`** - the driver exports
  `MSYS_NO_PATHCONV=1`. Consequence: inside the driver, Windows flags are `/F`, not `//F`
  (with `//F`, taskkill silently failed and Metro survived `down`).
- **`netstat -ano` lines end in CRLF** - strip `\r` before passing the PID to `taskkill`.
- **`uiautomator dump` fails intermittently while the UI animates** and leaves the previous
  `/sdcard/ui.xml`; the driver deletes it before each dump and retries node lookups 5x.
- **Testing offline behaviour:** `launch` first, *then* `adb shell svc wifi disable; adb shell svc
  data disable` (re-enable with `enable`). Cutting the network before launch also cuts the
  emulator's link to Metro -> red "Unable to load script" screen.
- The empty search field has no text node; it's found by class `android.widget.EditText`.
  The "Open debugger to view warnings" toast is harmless (InteractionManager deprecation).
- `android/gradle.properties` holds the release keystore passwords in clear text (gitignored).

## Troubleshooting

| Symptom | Fix |
|---|---|
| `No variants exist` for all `:react-native-*` projects | `bash $D build` (deletes stale autolinking cache) |
| `adb devices` shows `emulator-5554 offline` for minutes | `bash $D down && bash $D up` |
| `monkey ... No activities found` | APK not installed: `bash $D build` |
| `launch` fails, screenshot shows dark bootsplash | `bash $D logs`; check `curl localhost:8081/status`; `down` + `up` |
| `warning: something still serves :8081` after `down` | another Metro; find it with `netstat -ano \| grep :8081` |
