import {app, BrowserWindow, shell, globalShortcut} from 'electron';
import * as isDev from 'electron-is-dev';
import config from "../constants/environment-vars"
const { Deeplink } = require('electron-deeplink');
const log = require('electron-log');

console.log(`Is Dev? ${isDev}`)
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

let mainWindow: BrowserWindow | null = null;
const protocol = config.protocol;

// Instantiate Deep Link listener
const deeplink = new Deeplink({ app, mainWindow, protocol, isDev });

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// on macOS: ~/Library/Logs/{app name}/{process type}.log
log.info(`Main Window Webpack`)
log.info(MAIN_WINDOW_WEBPACK_ENTRY);

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 860,
    width: 1320,
    title: "Peak",
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (isDev){
    mainWindow.webContents.openDevTools({'mode': 'detach'});
  }

  // All new-window events should load in the user's default browser
  // new-window events are when a user clicks on <a> link with target="_blank"
  mainWindow.webContents.on("new-window", function(event, url) {
      event.preventDefault();
      shell.openExternal(url);
  });

  mainWindow.webContents.send('fullscreen', false)


  // If Full-screen, tell renderer (aka. the App that we are fullscreen)
  mainWindow.on("enter-full-screen", () => {
    console.log(`Entering full screen`)
    mainWindow && mainWindow.webContents.send('fullscreen', true)
  })

  // If not Full-screen, tell renderer (aka. the App that we are fullscreen)
  mainWindow.on("leave-full-screen", () => {
    console.log(`Leaving full screen`)
    mainWindow && mainWindow.webContents.send('fullscreen', false)
  })

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);
app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+Shift+J', () => {
    console.log('Electron loves global shortcuts!')
    mainWindow && mainWindow.webContents.send('go-to-journal')
    app.focus()
  })
}).then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
// Handle Deep Links
deeplink.on('received', (link: string) => {
  const [base_url, returned_code] = link.split("returned-code=")

  mainWindow = BrowserWindow.getAllWindows()[0]

  // TODO: Verify returned_code
  mainWindow && mainWindow.webContents.send('login-user', returned_code)
});

