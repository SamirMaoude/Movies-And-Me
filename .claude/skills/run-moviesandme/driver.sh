#!/usr/bin/env bash
# MoviesAndMe Android driver (Git Bash on Windows).
# Usage: bash .claude/skills/run-moviesandme/driver.sh <command> [args]
#   up                 boot emulator (if none) + start Metro (if not running) + adb reverse
#   build              fix stale autolinking cache, gradle installDebug (x86_64 only)
#   launch             (re)start the app, wait for the JS bundle to render
#   ss [name]          screenshot -> $OUT/<name>.png (prints the path)
#   tap-text <text>    tap the first UI node whose text/desc contains <text>
#   tap <x> <y>        raw tap, device pixels (1080x2400 on Medium_Phone_API_35)
#   type <text>        tap the first EditText, then type <text> (spaces ok)
#   search <query>     clear field, type query, press Enter, screenshot -> $OUT/search.png
#   tab <1|2|3>        switch tab: 1 Rechercher, 2 Favoris, 3 Nouveautés (closes LogBox toasts first)
#   close-toasts       close the dev-mode LogBox toasts (before a clean screenshot)
#   ui                 dump visible texts (text/content-desc + bounds)
#   logs               last JS/crash lines from logcat
#   down               stop Metro and the emulator
set -euo pipefail
export MSYS_NO_PATHCONV=1 # stop Git Bash rewriting /sdcard/... into C:/Program Files/Git/...
# (consequence: Windows flags are written /F, not the usual Git Bash //F)

UNIT="$(cd "$(dirname "$0")/../../.." && pwd)"
SDK="${ANDROID_HOME:-$LOCALAPPDATA/Android/Sdk}"
SDK="$(cygpath -u "$SDK")"
ADB="$SDK/platform-tools/adb.exe"
EMU="$SDK/emulator/emulator.exe"
AVD="${AVD:-Medium_Phone_API_35}"
PKG=com.protosol.moviesandme
OUT="${OUT:-$(cygpath -u "$TEMP")/moviesandme-run}"
mkdir -p "$OUT"

booted() { [ "$("$ADB" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = 1 ]; }
metro_up() { curl -s --max-time 2 http://localhost:8081/status | grep -q running; }

wait_boot() {
  for _ in $(seq 1 90); do booted && return 0; sleep 4; done
  echo "emulator did not boot (state: $("$ADB" devices | tail -n +2))" >&2; return 1
}

cmd_up() {
  "$ADB" start-server >/dev/null 2>&1
  if ! booted; then
    if "$ADB" devices | grep -q offline; then
      echo "device stuck offline -> killing and cold-booting"
      "$ADB" emu kill >/dev/null 2>&1 || true
      taskkill /F /IM emulator.exe >/dev/null 2>&1 || true
      sleep 3
    fi
    echo "cold-booting $AVD (log: $OUT/emulator.log)"
    nohup "$EMU" -avd "$AVD" -no-snapshot-load >"$OUT/emulator.log" 2>&1 &
    sleep 10
    wait_boot
  fi
  echo "emulator: booted"
  if ! metro_up; then
    echo "starting Metro (log: $OUT/metro.log)"
    (cd "$UNIT" && nohup npx react-native start >"$OUT/metro.log" 2>&1 &)
    for _ in $(seq 1 30); do metro_up && break; sleep 2; done
    metro_up || { echo "Metro did not start, see $OUT/metro.log" >&2; return 1; }
  fi
  echo "metro: running on 8081"
  "$ADB" reverse tcp:8081 tcp:8081 >/dev/null
}

cmd_build() {
  local al="$UNIT/android/build/generated/autolinking/autolinking.json"
  if [ -f "$al" ] && ! (cd "$UNIT" && node -e '
      const p=require("path"),j=require("./android/build/generated/autolinking/autolinking.json");
      process.exit(p.resolve(j.root)===p.resolve(".")?0:1)'); then
    echo "autolinking cache points at another root -> deleting it"
    rm -rf "$UNIT/android/build/generated/autolinking"
  fi
  (cd "$UNIT/android" && ./gradlew.bat app:installDebug \
      -PreactNativeDevServerPort=8081 -PreactNativeArchitectures=x86_64 \
      >"$OUT/gradle.log" 2>&1) || { tail -40 "$OUT/gradle.log"; return 1; }
  grep -E "Installed on|BUILD SUCCESSFUL" "$OUT/gradle.log"
}

cmd_launch() {
  "$ADB" reverse tcp:8081 tcp:8081 >/dev/null
  # `emu kill` can lose recent userdata writes -> the APK may be gone after a restart
  "$ADB" shell pm list packages | grep -q "$PKG" || { echo "$PKG not installed, building"; cmd_build; }
  # first launch right after a cold boot sometimes hangs on the bootsplash -> relaunch once
  for attempt in 1 2; do
    "$ADB" shell am force-stop $PKG
    # not `monkey -p PKG 1`: on top of launching, monkey injects one random tap/swipe
    "$ADB" shell am start -n $PKG/.MainActivity >/dev/null
    # first load bundles ~1200 modules (~30s); later loads are a few seconds
    for _ in $(seq 1 25); do
      # the search field (EditText) only exists on the search screen, shown at startup
      dump 2>/dev/null | grep -q "android.widget.EditText" && { echo "app ready"; return 0; }
      sleep 2
    done
    echo "attempt $attempt: search screen not rendered" >&2
  done
  echo "app did not render the search screen; see: driver.sh logs / ss" >&2; return 1
}

cmd_ss() {
  local f="$OUT/${1:-screen}.png"
  "$ADB" exec-out screencap -p >"$f"; cygpath -w "$f"
}

dump() {
  # uiautomator dump sometimes fails while the app animates; never read a stale file
  "$ADB" shell rm -f /sdcard/ui.xml
  "$ADB" shell uiautomator dump /sdcard/ui.xml >/dev/null 2>&1 || true
  "$ADB" exec-out cat /sdcard/ui.xml 2>/dev/null | tr '>' '\n' || true
}

cmd_ui() {
  dump | grep -oE '(text|content-desc)="[^"]+"[^/]*bounds="[^"]+"' \
       | sed -E 's/^(text|content-desc)="([^"]*)".*bounds="([^"]*)"/\2\t\3/'
}

tap_node() { # $1 = grep pattern for the node line
  local b=""
  for _ in 1 2 3 4 5; do
    b=$(dump | grep -E "$1" | head -1 | grep -oE 'bounds="\[[0-9]+,[0-9]+\]\[[0-9]+,[0-9]+\]"' || true)
    [ -n "$b" ] && break; sleep 1
  done
  [ -n "$b" ] || { echo "no node matching: $1" >&2; return 1; }
  read -r x1 y1 x2 y2 <<<"$(echo "$b" | grep -oE '[0-9]+' | tr '\n' ' ')"
  "$ADB" shell input tap $(((x1 + x2) / 2)) $(((y1 + y2) / 2))
}

type_text() {
  tap_node 'class="android.widget.EditText"'
  sleep 0.5
  # vide le champ (curseur en fin de texte puis 60 x Retour arrière), sinon le texte s'ajoute à l'ancien
  "$ADB" shell input keyevent KEYCODE_MOVE_END $(printf 'KEYCODE_DEL %.0s' $(seq 1 60))
  "$ADB" shell input text "${*// /%s}"
}

cmd_type() {
  type_text "$@"
  "$ADB" shell input keyevent 111 # ESC: hide keyboard
}

cmd_close_toasts() {
  # dev-mode LogBox toast(s) ("Open debugger to view warnings"): they hide the tab bar and spoil screenshots.
  # Close each one with its X (right end of the toast)
  local b
  for _ in 1 2 3; do
    b=$(dump | grep -E 'content-desc="[^"]*Open debugger' | head -1 | grep -oE 'bounds="\[[0-9]+,[0-9]+\]\[[0-9]+,[0-9]+\]"' || true)
    [ -n "$b" ] || break
    read -r x1 y1 x2 y2 <<<"$(echo "$b" | grep -oE '[0-9]+' | tr '\n' ' ')"
    "$ADB" shell input tap $((x2 - 58)) $(((y1 + y2) / 2)); sleep 0.5
  done
}

cmd_tab() { # $1 = 1 (Rechercher) | 2 (Favoris) | 3 (Nouveautés); tapped by position (labels are also screen titles)
  cmd_close_toasts # the toasts swallow taps on the tab bar
  "$ADB" shell input tap $(((2 * $1 - 1) * 1080 / 6)) 2270
}

cmd_search() {
  # the app searches while typing; Enter submits right away and closes the keyboard
  type_text "$@"
  "$ADB" shell input keyevent 66 # ENTER
  sleep 5
  cmd_ss search
}

cmd_logs() {
  # (D/I AndroidRuntime lines are uiautomator noise, hence "E AndroidRuntime")
  "$ADB" logcat -d -t 400 | grep -E "ReactNativeJS|E AndroidRuntime|FATAL" | tail -40 || true
}

cmd_down() {
  # netstat lines end in CRLF: strip \r or taskkill gets "4432\r" and silently fails
  for pid in $(netstat -ano | tr -d '\r' | grep -E ':8081 .*LISTENING' | awk '{print $NF}' | sort -u); do
    taskkill /F /T /PID "$pid" >/dev/null 2>&1 || true
  done
  "$ADB" emu kill >/dev/null 2>&1 || true
  # wait until the emulator is really gone, otherwise a following `up` sees it as "booted"
  for _ in $(seq 1 20); do "$ADB" devices | grep -q emulator- || break; sleep 2; done
  for _ in $(seq 1 10); do metro_up || break; sleep 1; done # node takes a few s to exit
  metro_up && echo "warning: something still serves :8081" >&2
  echo "stopped"
}

c="${1:-}"; shift || true
case "$c" in
  up) cmd_up ;; build) cmd_build ;; launch) cmd_launch ;; ss) cmd_ss "$@" ;;
  tap-text) tap_node "(text|content-desc)=\"[^\"]*$1" ;;
  tap) "$ADB" shell input tap "$1" "$2" ;;
  type) cmd_type "$@" ;; search) cmd_search "$@" ;; tab) cmd_tab "$1" ;; close-toasts) cmd_close_toasts ;; ui) cmd_ui ;;
  logs) cmd_logs ;; down) cmd_down ;;
  *) sed -n '2,16p' "$0"; exit 1 ;;
esac
