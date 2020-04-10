import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkForUpdates, downloadUpdate, quitAndInstall, setVisible } from 'actions/AutoUpdaterActions';
import { getDownloadProgress, getUpdateDownloaded, getUpdateInfo, isVisible } from 'selectors/AutoUpdaterSelectors';

export function useAutoUpdaterApi() {
    const dispatch = useDispatch();

    const visible = useSelector(isVisible);
    const updateInfo = useSelector(getUpdateInfo);
    const downloadProgress = useSelector(getDownloadProgress);
    const updateDownloaded = useSelector(getUpdateDownloaded);

    const setVisibleCallback = useCallback(
        visible => dispatch(setVisible(visible)),
        [dispatch]
    );

    const checkForUpdatesCallback = useCallback(
        quiet => dispatch(checkForUpdates(quiet)),
        [dispatch]
    );

    const downloadUpdateCallback = useCallback(
        () => dispatch(downloadUpdate()),
        [dispatch]
    );

    const quitAndInstallCallback = useCallback(
        () => dispatch(quitAndInstall()),
        [dispatch]
    );

    return {
        visible,
        updateInfo,
        downloadProgress,
        updateDownloaded,
        setVisible: setVisibleCallback,
        checkForUpdates: checkForUpdatesCallback,
        downloadUpdate: downloadUpdateCallback,
        quitAndInstall: quitAndInstallCallback
    };
}