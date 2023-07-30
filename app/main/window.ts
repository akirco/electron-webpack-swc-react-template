import { BrowserWindow, Menu } from 'electron';
import { join } from 'path';

export default function createWindow() {
  const { APP_ENV } = process.env;

  console.log('APP_ENV:', APP_ENV);

  const mainWindow = new BrowserWindow({
    width: 1395,
    height: 882,
    backgroundColor: '#909090',
    backgroundMaterial: 'acrylic',
    title: '',
    icon: join(process.cwd(), 'resources', 'app.ico'),
    webPreferences: {
      preload: join(__dirname, './preload.js'),
    },
  });
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate([]));
  if (APP_ENV === 'development') {
    mainWindow.loadURL('http://127.0.0.1:6325');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(process.cwd(), 'dist/renderer/index.html'));
  }
}
