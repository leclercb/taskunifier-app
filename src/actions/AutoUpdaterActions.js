import { notification } from 'antd';
import { getSettings } from 'selectors/SettingSelectors';
import { updateSettings } from 'actions/SettingActions';
import { compareVersions } from 'utils/CompareUtils';
import { getAppVersion } from 'utils/VersionUtils';

export function setVisible(visible) {
    return async dispatch => {
        dispatch({
            type: 'SET_VISIBLE',
            visible
        });
    };
}

function setUpdateInfo(info) {
    return async dispatch => {
        dispatch({
            type: 'SET_UPDATE_INFO',
            updateInfo: info
        });
    };
}

function setDownloadProgress(info) {
    return async dispatch => {
        dispatch({
            type: 'SET_DOWNLOAD_PROGRESS',
            downloadProgress: info
        });
    };
}

function setUpdateDownloaded(info) {
    return async dispatch => {
        dispatch({
            type: 'SET_UPDATE_DOWNLOADED',
            updateDownloaded: info
        });
    };
}

export function checkForUpdates(quiet) {
    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const electron = window.require('electron');
        const { autoUpdater } = electron.remote.require('electron-updater');

        const updateCheckResult = await autoUpdater.checkForUpdates();

        const currentVersion = getAppVersion();
        const latestVersion = updateCheckResult.updateInfo.version;

        if (quiet && settings.checkLatestVersion === latestVersion) {
            return null;
        }

        if (compareVersions(latestVersion, currentVersion) > 0) {
            await dispatch(setUpdateInfo(updateCheckResult.updateInfo));
            await dispatch(setVisible(true));
            await dispatch(updateSettings({ checkLatestVersion: latestVersion }));

            return updateCheckResult;
        } else {
            if (!quiet) {
                notification.success({
                    message: 'You already have the latest version'
                });
            }

            return null;
        }
    };
}

export function downloadUpdate() {
    return async dispatch => {
        return new Promise((resolve, reject) => {
            const electron = window.require('electron');
            const { autoUpdater, CancellationToken } = electron.remote.require('electron-updater');

            const downloadProgressHandler = info => {
                dispatch(setDownloadProgress(info));
            };

            const updateDownloadedHandler = info => {
                dispatch(setUpdateDownloaded(info));
                autoUpdater.removeListener('download-progress', downloadProgressHandler);
                autoUpdater.removeListener('update-downloaded', updateDownloadedHandler);
                resolve(info);
            };

            try {
                autoUpdater.on('download-progress', downloadProgressHandler);
                autoUpdater.on('update-downloaded', updateDownloadedHandler);

                const cancellationToken = new CancellationToken();
                autoUpdater.downloadUpdate(cancellationToken);
                dispatch(setDownloadProgress({ progress: 0 }));
            } catch (e) {
                autoUpdater.removeListener('download-progress', downloadProgressHandler);
                autoUpdater.removeListener('update-downloaded', updateDownloadedHandler);
                reject(e);
            }
        });
    };
}

export function quitAndInstall() {
    return async () => {
        const electron = window.require('electron');
        const { autoUpdater } = electron.remote.require('electron-updater');

        autoUpdater.quitAndInstall();
    };
}