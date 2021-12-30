const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'electron',
    {
        ipcRenderer: {
            invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
            on: (channel, listener) => ipcRenderer.on(channel, listener),
            removeListener: (channel, listener) => ipcRenderer.removeListener(channel, listener),
            removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
            send: (channel, ...args) => ipcRenderer.send(channel, ...args),
            sendSync: (channel, ...args) => ipcRenderer.sendSync(channel, ...args)
        }
    }
);