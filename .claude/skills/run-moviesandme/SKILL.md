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
bash $D search "Matrix"    # clear field, type, press Enter, screenshot -> prints .png path
bash $D search 'Fast \& Furious'   # "&" must be escaped (adb input runs through the device shell)
bash $D tab 3              # switch tab: 1 Rechercher, 2 Favoris, 3 Nouveautés
bash $D tap-text "Matrix Reloaded"   # open a result (matches text/content-desc substring)
bash $D close-toasts       # close the dev-mode LogBox toasts before a clean screenshot
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

Useful accessibility labels for `tap-text`: `Ajouter aux favoris` / `Retirer des favoris` and
`Partager` (film header), `Navigate up` (back arrow), `Effacer la recherche`, `Rechercher un film`
(search field), `Réessayer`, `Changer la photo de profil`, `Voir la bande-annonce`, and each
platform logo under "Où regarder" (`Netflix (abonnement)`…; scroll down first). Tap a result card
by a phrase of its overview, not its title (the search field holds the title too).
`tap-text` takes an **extended regex**: `tap-text "Netflix (abonnement)"` does not match (the
parentheses are a group) - use `tap-text "Netflix"` or escape them.

External links (trailer, platform logos) leave the app: on this fresh emulator they land on
Chrome's first-run screen or YouTube's cookie consent. Check with
`adb shell dumpsys activity activities | grep -m1 topResumedActivity`, then come back with
`adb shell am force-stop com.android.chrome` (and `com.google.android.youtube`).

```bash
# slow network, to see the loading skeletons (restore with: speed full / delay none)
ADB=$LOCALAPPDATA/Android/Sdk/platform-tools/adb.exe
"$ADB" emu network delay gprs; "$ADB" emu network speed gsm
# pull-to-refresh (Nouveautés): `input swipe` is too fast for Android, drag step by step
"$ADB" shell "input motionevent DOWN 540 500; for y in 560 640 720 800 900 1000 1100 1200 1300; do input motionevent MOVE 540 \$y; done; input motionevent UP 540 1300"
"$ADB" shell cmd uimode night yes   # dark theme (night no to go back)
```

## Run (human path)

```bash
npx react-native start    # terminal 1
env -u NoDefaultCurrentDirectoryInExePath npm run android -- --no-packager --active-arch-only   # terminal 2
```
Plain `npm run android` fails on this machine (see Gotchas); `--active-arch-only` builds only the
emulator's ABI (much faster than the 4 default ones).

## Release (Play Store)

Bump `versionCode` (+1, must exceed the last upload) and `versionName` in `android/app/build.gradle`
(`npm version X.Y.Z --no-git-tag-version` for package.json). Signing uses `MYAPP_UPLOAD_*` from
`~/.gradle/gradle.properties`.

```bash
cd android && ./gradlew.bat bundleRelease     # ~9 min (4 ABIs) -> app/build/outputs/bundle/release/app-release.aab
# check: signer, version, permissions, embedded JS
"$JAVA_HOME/bin/jarsigner" -verify -verbose -certs app/build/outputs/bundle/release/app-release.aab | grep -m1 X.509
grep -oE 'android:version(Code|Name)="[^"]+"|uses-permission[^>]*name="[^"]+"' app/build/intermediates/bundle_manifest/release/processApplicationManifestReleaseForBundle/AndroidManifest.xml
# smoke-test the release build on the emulator (no Metro): different signing key than debug,
# so uninstall first; reinstall debug afterwards with `bash $D build`
./gradlew.bat assembleRelease -PreactNativeArchitectures=x86_64
adb uninstall com.protosol.moviesandme && adb install app/build/outputs/apk/release/app-release.apk
```

## Test

```bash
npx jest    # 5 suites / 25 tests: App smoke test, Helpers/format.js, Helpers/media.js, usePaginatedFilms, favorites reducer
```
Native modules are mocked in `jest.setup.js` (bootsplash, AsyncStorage, Reanimated/Worklets via
their `lib/module/mock`); ESM deps are whitelisted in `jest.config.js` (`transformIgnorePatterns`),
and `lucide-react-native` is mapped to its CommonJS build (its React Native entry is a `.mjs` Jest
won't transform). Fake timers are global (`fakeTimers.enableGlobally`): otherwise the 5 s timeout
created by `persistStore` at import time keeps Jest from exiting.

## Gotchas

- **`npx react-native run-android` -> `'gradlew.bat' n'est pas reconnu`.** The machine sets
  `NoDefaultCurrentDirectoryInExePath=1`, so cmd won't run `gradlew.bat` from the cwd.
  The driver calls `./gradlew.bat` explicitly; `env -u NoDefaultCurrentDirectoryInExePath` fixes the CLI.
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
- **Tabs: use `tab N`, not `tap-text`** - the tab labels are also screen titles. A dev-mode LogBox
  toast ("Open debugger to view warnings") can swallow taps on the tab bar; `tab N` closes it first.
  Cutting the network makes one appear (Metro's websocket drops: harmless, not an app error).
- **`launch` uses `am start -n com.protosol.moviesandme/.MainActivity`, not `monkey -p ... 1`**:
  monkey also injects one random event, which opened random tabs/films right after launch.
- **`input text` cannot type accented letters** (`è` -> NullPointerException in InputShellCommand):
  search with ASCII words (`Dune`), then `tap-text` an accented phrase (grep handles UTF-8).
- **Each tab keeps its own stack**: after opening a film, coming back to that tab shows the film,
  not the list. Press back (`adb shell input keyevent 4`) before `search`.
- Right after re-enabling the network, `uiautomator dump` may fail for a few seconds: wait ~10 s
  before `tap-text`.
- The search field is found by class `android.widget.EditText` (its text is the hint when empty).
- Release signing properties (`MYAPP_UPLOAD_*`) live in `~/.gradle/gradle.properties`, outside the
  repo; `android/app/build.gradle` only applies them if present, so debug builds work without them.
  Never write them into `android/gradle.properties` (tracked, public repo).

## Troubleshooting

| Symptom | Fix |
|---|---|
| `No variants exist` for all `:react-native-*` projects | `bash $D build` (deletes stale autolinking cache) |
| `adb devices` shows `emulator-5554 offline` for minutes | `bash $D down && bash $D up` |
| `launch` fails, screenshot shows dark bootsplash | `bash $D logs`; check `curl localhost:8081/status`; `down` + `up` |
| `warning: something still serves :8081` after `down` | another Metro; find it with `netstat -ano \| grep :8081` |
