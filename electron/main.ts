import * as url from 'url';
import * as path from 'path';
import { app, nativeImage, Tray, Notification, Menu, BrowserWindow } from 'electron'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import batteryStatus from '../src/helpers/BatteryStatus';
import isConnected from '../src/helpers/isConnected';

let mainWindow: Electron.BrowserWindow | null

let tray: Tray | undefined;
let intervalId: number | undefined;

let batteryLeft = 0;
let batteryRight = 0;

app.dock.hide();

function batteryChecker() {
  const connected = isConnected();
  const battery = batteryStatus();

  if ((batteryLeft >= 20 && batteryRight >= 20) && (battery.left < 20 || battery.right < 20)) {
    notify();
  }

  batteryLeft = battery.left;
  batteryRight = battery.right;

  if (!connected) {
    tray!.setTitle('');
  } else {
    tray!.setTitle(`L ${battery.left}% / R ${battery.right}%`);
  }
}

function notify() {
  new Notification({
    title: '🔋 AirPods battery low',
    body: '20%',
  }).show();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000')
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true
      })
    )
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  });
}

function create() {
  if (process.env.NODE_ENV === 'development') {
    createWindow();
  }
  const path = `${app.getAppPath()}/assets/icon/airpods_black.png`;
  const image = nativeImage.createFromPath(path);
  image.setTemplateImage(true);

  tray = new Tray(image);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: () => app.quit(),
    }
  ]);

  tray.setContextMenu(contextMenu);

  intervalId = setInterval(batteryChecker, 2000) as any;

  tray.setToolTip('AirPods battery');
}

app
  .on('ready', create)
  .whenReady()
  .then(() => {
    new Notification({
      title: 'Notifications enabled',
      body: '🎉',
    }).show();

    if (process.env.NODE_ENV === 'development') {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    }
  });

app
  .on('before-quit', () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
