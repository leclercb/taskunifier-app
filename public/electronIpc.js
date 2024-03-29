const axios = require('axios');
const crypto = require('crypto');
const { app, dialog, ipcMain, shell, BrowserWindow } = require('electron');
const { autoUpdater, CancellationToken } = require('electron-updater');
const log = require('electron-log');
const fse = require('fs-extra');
const { google } = require('googleapis');
const HttpsProxyAgent = require('https-proxy-agent');
const os = require('os');
const path = require('path');

let googleAuthClient = null;
let googleCalendarClient = null;

async function sendRequest(axiosInstance, config) {
    const result = await axiosInstance(config);

    return {
        status: result.status,
        statusText: result.statusText,
        headers: result.headers,
        data: result.data
    };
}

function initializeIpc(setQuitInitiated) {
    ipcMain.handle('app-get-path', (event, p) => {
        return app.getPath(p);
    });

    ipcMain.on('app-get-path-sync', (event, p) => {
        event.returnValue = app.getPath(p);
    });

    ipcMain.handle('app-get-version', () => {
        return app.getVersion();
    });

    ipcMain.handle('app-set-badge-count', (event, count) => {
        app.setBadgeCount(count);
    });

    ipcMain.handle('auto-updater-check-updates', () => {
        return autoUpdater.checkForUpdates();
    });

    ipcMain.handle('auto-updater-download-update', async event => {
        const downloadProgressHandler = info => {
            event.sender.send('download-progress', info);
        };

        const updateDownloadedHandler = info => {
            autoUpdater.removeListener('download-progress', downloadProgressHandler);
            autoUpdater.removeListener('update-downloaded', updateDownloadedHandler);
            event.sender.send('update-downloaded', info);
        };

        autoUpdater.on('download-progress', downloadProgressHandler);
        autoUpdater.on('update-downloaded', updateDownloadedHandler);

        try {
            return await autoUpdater.downloadUpdate(new CancellationToken());
        } catch (e) {
            autoUpdater.removeListener('download-progress', downloadProgressHandler);
            autoUpdater.removeListener('update-downloaded', updateDownloadedHandler);
            throw e;
        }
    });

    ipcMain.handle('auto-updater-quit-and-install', () => {
        autoUpdater.quitAndInstall();
    });

    ipcMain.handle('axios', (event, config) => {
        return sendRequest(axios, config);
    });

    ipcMain.handle('axios-create', (event, config, createConfig, httpsAgent) => {
        if (httpsAgent) {
            createConfig.httpsAgent = new HttpsProxyAgent(httpsAgent);
        }

        return sendRequest(axios.create(createConfig), config);
    });

    ipcMain.on('crypto-verify-sync', (event, algorithm, message, object, signature, signatureFormat) => {
        const verifier = crypto.createVerify(algorithm);
        verifier.update(message);
        event.returnValue = verifier.verify(object, signature, signatureFormat);
    });

    ipcMain.handle('current-window-close', event => {
        BrowserWindow.fromWebContents(event.sender).close();
    });

    ipcMain.handle('current-window-get-position', event => {
        return BrowserWindow.fromWebContents(event.sender).getPosition();
    });

    ipcMain.handle('current-window-get-size', event => {
        return BrowserWindow.fromWebContents(event.sender).getSize();
    });

    ipcMain.handle('dialog-show-open-dialog', (event, options) => {
        return dialog.showOpenDialog(options);
    });

    ipcMain.handle('dialog-show-save-dialog', (event, options) => {
        return dialog.showSaveDialog(options);
    });

    ipcMain.handle('fse-access', (event, p) => {
        return fse.access(p, fse.constants.F_OK);
    });

    ipcMain.handle('fse-copy-file', (event, src, dest) => {
        return fse.copyFile(src, dest);
    });

    ipcMain.handle('fse-ensure-dir', (event, p) => {
        return fse.ensureDir(p);
    });

    ipcMain.handle('fse-lstat', (event, p) => {
        return fse.lstat(p);
    });

    ipcMain.handle('fse-read-file', (event, p, encoding) => {
        return fse.readFile(p, encoding);
    });

    ipcMain.handle('fse-readdir', (event, p) => {
        return fse.readdir(p);
    });

    ipcMain.handle('fse-remove', (event, p) => {
        return fse.remove(p);
    });

    ipcMain.handle('fse-write-file', (event, file, data) => {
        return fse.writeFile(file, data);
    });

    ipcMain.handle('google-set-auth-client', (event, config, settings) => {
        const client = new google.auth.OAuth2(
            config.clientId,
            config.clientSecret,
            config.redirectUri
        );

        if (settings && settings.tokens) {
            client.setCredentials(settings.tokens);
        }

        googleAuthClient = client;
    });

    ipcMain.handle('google-set-calendar-client', () => {
        const client = google.calendar({
            version: 'v3',
            auth: googleAuthClient
        });

        googleCalendarClient = client;
    });

    ipcMain.handle('google-generate-auth-url', async () => {
        const url = googleAuthClient.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/calendar'
            ]
        });

        return url;
    });

    ipcMain.handle('google-get-tokens', async (event, code) => {
        const { tokens } = await googleAuthClient.getToken(code);
        return tokens;
    });

    ipcMain.handle('google-get-user-info', async () => {
        const profile = google.oauth2({
            version: 'v2',
            auth: googleAuthClient
        });

        const result = await profile.userinfo.get();
        return result.data;
    });

    ipcMain.handle('google-calendars-list', async (event, data) => {
        const result = await googleCalendarClient.calendarList.list(data);
        return result.data;
    });

    ipcMain.handle('google-calendars-insert', async (event, data) => {
        const result = await googleCalendarClient.calendars.insert(data);
        return result.data;
    });

    ipcMain.handle('google-events-list', async (event, data) => {
        const result = await googleCalendarClient.events.list(data);
        return result.data;
    });

    ipcMain.handle('google-events-insert', async (event, data) => {
        const result = await googleCalendarClient.events.insert(data);
        return result.data;
    });

    ipcMain.handle('google-events-delete', async (event, data) => {
        const result = await googleCalendarClient.events.delete(data);
        return result.data;
    });

    ipcMain.handle('initiate-quit', () => {
        setQuitInitiated(true);
    });

    ipcMain.handle('log', (event, type, ...params) => {
        log[type](...params);
    });

    ipcMain.handle('log-get-file', () => {
        return log.transports.file.resolvePath;
    });

    ipcMain.handle('log-set-level', (event, level) => {
        log.transports.file.level = level;
    });

    ipcMain.handle('os-platform', () => {
        return os.platform();
    });

    ipcMain.handle('path-dirname', (event, p) => {
        return path.dirname(p);
    });

    ipcMain.on('path-join-sync', (event, ...paths) => {
        event.returnValue = path.join(...paths);
    });

    ipcMain.handle('process-get-env', () => {
        return {
            TASKUNIFIER_DATA_FOLDER: process.env.TASKUNIFIER_DATA_FOLDER
        };
    });

    ipcMain.handle('shell-open-external', (event, url) => {
        shell.openExternal(url);
    });

    ipcMain.handle('shell-open-path', (event, p) => {
        shell.openPath(p);
    });
}

module.exports = {
    initializeIpc
};