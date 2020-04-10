const AutoUpdater = () => (state = {
    visible: false,
    updateInfo: null,
    downloadProgress: null,
    updateDownloaded: null
}, action) => {
    switch (action.type) {
        case 'SET_VISIBLE':
            return {
                ...state,
                visible: action.visible
            };
        case 'SET_UPDATE_INFO':
            return {
                ...state,
                updateInfo: action.updateInfo
            };
        case 'SET_DOWNLOAD_PROGRESS':
            return {
                ...state,
                downloadProgress: action.downloadProgress
            };
        case 'SET_UPDATE_DOWNLOADED':
            return {
                ...state,
                downloadProgress: null,
                updateDownloaded: action.updateDownloaded
            };
        default:
            return state;
    }
};

export default AutoUpdater;