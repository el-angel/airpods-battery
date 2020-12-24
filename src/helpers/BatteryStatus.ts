import { spawnSync } from 'child_process';

const get = (which: 'BatteryPercentLeft' | 'BatteryPercentRight') => {
  const cmd = 'defaults read /Library/Preferences/com.apple.Bluetooth | grep ' + which;

  const { stdout } = spawnSync('sh', ['-c', cmd], {
    encoding: 'utf-8'
  });


  const keyValue = stdout.substr(0, stdout.length - 2);

  const [, value] = keyValue.split('=');

  return value.trim();
}

const batteryStatus = (): { left: number, right: number } => {
  return {
    left: Number(get('BatteryPercentLeft')),
    right: Number(get('BatteryPercentRight')),
  }
}

export default batteryStatus;
