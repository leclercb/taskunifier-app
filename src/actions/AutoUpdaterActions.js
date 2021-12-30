import { notification } from 'antd';
import { getSettings } from 'selectors/SettingSelectors';
import { updateSettings } from 'actions/SettingActions';
import { compareVersions } from 'utils/CompareUtils';
import {
    checkForUpdates as electronCheckForUpdates,
    downloadUpdate as electronDownloadUpdate,
    quitAndInstall as electronQuitAndInstall,
    getAppVersion,
    initiateQuit
} from 'utils/ElectronIpc';
import logger from 'utils/LogUtils';

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

        const updateCheckResult = await electronCheckForUpdates();

        const currentVersion = await getAppVersion();
        const latestVersion = updateCheckResult.updateInfo.version;

        logger.info('Check for updates', currentVersion, latestVersion);

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
            const { ipcRenderer } = window.electron;

            const downloadProgressHandler = (event, info) => {
                logger.debug('Download progress', info.percent);
                dispatch(setDownloadProgress(info));
            };

            const updateDownloadedHandler = (event, info) => {
                logger.debug('Update downloaded', info);
                dispatch(setUpdateDownloaded(info));
                ipcRenderer.removeAllListeners('download-progress');
                ipcRenderer.removeAllListeners('update-downloaded');
                resolve(info);
            };

            ipcRenderer.on('download-progress', downloadProgressHandler);
            ipcRenderer.on('update-downloaded', updateDownloadedHandler);

            logger.info('Download update');

            dispatch(setDownloadProgress({ progress: 0 }));

            electronDownloadUpdate().catch(e => {
                logger.error('Download update error', e);

                ipcRenderer.removeAllListeners('download-progress');
                ipcRenderer.removeAllListeners('update-downloaded');
                reject(e);
            });
        });
    };
}

export function quitAndInstall() {
    return async () => {
        logger.info('Quit and install');

        initiateQuit();
        electronQuitAndInstall();
    };
}