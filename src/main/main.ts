/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, session, clipboard } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import axios, { all } from 'axios';
// const path = require('path');
import fs from 'fs';

log.transports.console.level = 'info';
log.transports.console.format = '{h}:{i}:{s} {text}';

const { spawn } = require('child_process');

// const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});
// ipcMain.on('run-shell-command', (event, command) => {
//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       event.reply('shell-command-response', `Error: ${error.message}`);
//       return;
//     }
//     if (stderr) {
//       event.reply('shell-command-response', `Stderr: ${stderr}`);
//       return;
//     }
//     event.reply('shell-command-response', `Stdout: ${stdout}`);
//   });
// });

ipcMain.on('run-shell-command', (event, command) => {
  const child = spawn(command, { shell: true });

  child.stdout.on('data', (data) => {
    event.sender.send('shell-command-response', data.toString());
  });

  // child.stderr.on('data', (data) => {
  //   event.sender.send('shell-command-response', `Error: ${data.toString()}`);
  // });

  child.on('close', (code) => {
    event.sender.send('shell-command-response', `Process exited with code ${code}`);
  });
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
     await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),

    webPreferences: {
      // contextIsolation:false,
      // devTools: false,
      // contextIsolation: true,

      // contextIsolation: false,
      disableDialogs:false,
      nodeIntegration: true,
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
        sandbox: true,
    },
  });
//"http://127.0.0.1:8848/lab?token=6da5d87e42970155a02414355806a0d962527e48e704cc8")//
  mainWindow.loadURL(resolveHtmlPath('index.html'));


  session.defaultSession.on('will-download', (event, item, webContents) => {
    // Set the save path, making Electron not to prompt a save dialog.
    const filePath = path.join(app.getPath('downloads'), item.getFilename());
    item.setSavePath(filePath);

    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed');
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused');
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`);
        }
      }
    });

    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully');
      } else {
        console.log(`Download failed: ${state}`);
      }
    });
  });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    // log.info('Headers received:', details);
    callback({
        responseHeaders: {
            ...details.responseHeaders,
            'Access-Control-Allow-Origin': ['*'], // Allow all origins
            'Access-Control-Allow-Headers': ['*'], // Allow all headers
            'Content-Security-Policy': [
             // "default-src 'self' *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' *; frame-src 'self' *; frame-ancestors 'self' * chrome-extension:*; connect-src 'self' * ws: wss:",
             //   "default-src 'self' *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' *; frame-src 'self' *; frame-ancestors 'self' * chrome-extension:*; connect-src 'self' * ws: wss:;",
             //"default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data: blob:; frame-src *; frame-ancestors *; connect-src * ws: wss:;",
             //"default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data: blob:; frame-src *; frame-ancestors * chrome-extension:; connect-src * ws: wss:;",
             //"frame-ancestors 'self' chrome-extension:; report-uri /api/security/csp-report; default-src 'none'"
             "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data: blob:; frame-src *; frame-ancestors 'self' * chrome-extension:; connect-src * ws: wss:; report-uri /api/security/csp-report;"
            //  "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data: blob:; frame-src *; frame-ancestors 'self' * chrome-extension:; connect-src * ws: wss:; report-uri /api/security/csp-report;"


            ],
             'Referrer-Policy': ['no-referrer'],
        },
    });
});
session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
  if (details.resourceType === 'subFrame' && details.redirectURL) {
    callback({ cancel: false });
  } else {
    callback({});
  }
});

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
    if (mainWindow.webContents.isDevToolsOpened()) {
      // mainWindow.webContents.closeDevTools();
    }
    mainWindow?.webContents.executeJavaScript(`

        window.electron.onShellCommandResponse((data,d) => {

          console.log(d);
          // console.log(extractCid(d));

      });
    `)
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
  // ipcMain.on('open-dev-tools', () => {
  //   mainWindow.webContents.openDevTools();
  //   mainWindow.webContents.on('devtools-opened', () => {
  //     // Execute JavaScript to switch to the console tab
  //   //  console.log("test");
  //   // mainWindow.webContents = mainWindow;
  //     mainWindow?.webContents.executeJavaScript(`
  //         // console.log(window.__devtools);
  //         //let devTools = window.__devtools;
  //         if (window.__devtools) {
  //             let consolePanel = window.__devtools.panels.find(panel => panel.name === 'console');
  //             console.log(consolePanel)
  //             if (consolePanel) {
  //                 consolePanel.open();
  //             }
  //         }
  //     `);
  // });
  // });
  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
    // window.electron.runShellCommand("docker run -it --gpus=all --rm -p 8081:8081 sorokine/docker-colab-local")
    // spawn("docker run -it --gpus=all --rm -p 8081:8081 sorokine/docker-colab-local", { shell: true });
    // const allLilypadURL = 'https://raw.githubusercontent.com/Lilypad-Tech/module-allowlist/main/allowlist.json'
    // const response = await axios.get(allLilypadURL);
    // response.data?.map(async (module:any) => {
    // if(module.ModuleId.startsWith("http")){
    //   const moduleUrl = module.ModuleId.replace("github.com","raw.githubusercontent.com") + "/main/lilypad_module.json.tmpl"
    //   const response = await axios.get(moduleUrl ,{ responseType: 'text' });
    //   try{
    //     const cleanedJsonString = response.data.toString().match(/"Image":\s*"([^"]+)"/)[1];//.replace(/{{.*?}}/g, '');
    //     console.log(cleanedJsonString)
    //     window.electron.runShellCommand('docker pull ' + cleanedJsonString);
    //   }
    //   catch(e){
    //     console.log(e)
    //   }
    //   }
    // })
  })
  .catch(console.log);
// console.log("downloads",app.getPath('downloads'))
// Expose getAppPath to the renderer process
ipcMain.handle('get-app-path', () => {
  return app.getAppPath();
})

ipcMain.handle('read-clipboard', () => {
  return clipboard.readText();
});

ipcMain.handle('write-clipboard', (event, text) => {
  clipboard.writeText(text);
});
ipcMain.handle('read-directory', async (event, dirPath) => {
  return fs.readdirSync(dirPath);
});
