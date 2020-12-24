#!/usr/local/bin/bash
# Airpods.sh
# Output connected Airpods battery levels via CLI

AIRPOD_ICON=$'\uF7CC';

BT_DEFAULTS=$(defaults read /Library/Preferences/com.apple.Bluetooth)
SYS_PROFILE=$(system_profiler SPBluetoothDataType 2>/dev/null)
MAC_ADDR=$(grep -b2 "Minor Type: Headphones"<<<"${SYS_PROFILE}"|awk '/Address/{print $3}')
CONNECTED=$(grep -ia6 "${MAC_ADDR}"<<<"${SYS_PROFILE}"|awk '/Connected: Yes/{print 1}')

if [[ "${CONNECTED}" ]]; then
  printf "true"
else
  printf "false"
fi
