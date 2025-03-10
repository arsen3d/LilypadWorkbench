// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  readDirectory: (dirPath:string) => ipcRenderer.invoke('read-directory', dirPath),
  readClipboard: () => ipcRenderer.invoke('read-clipboard'),
  writeClipboard: (text:any) => ipcRenderer.invoke('write-clipboard', text),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  runShellCommand: (command:any) => ipcRenderer.send('run-shell-command', command),
  onShellCommandResponse: (callback:any) => ipcRenderer.on('shell-command-response', callback),
  runShellCommandWithCallback: (command: any, callback: (response: any) => void) => {
    ipcRenderer.send('run-shell-command', command);
    ipcRenderer.once('shell-command-response', (_event, response) => {
      callback(response);
    });
  },

  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
