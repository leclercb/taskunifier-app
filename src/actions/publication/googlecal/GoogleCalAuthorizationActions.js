import { updateSettings } from 'actions/SettingActions';
import { getConfig } from 'config/Config';
import { openExternal } from 'utils/ElectronIpc';
import logger from 'utils/LogUtils';

export function setAuthClient(settings = null) {
    const { ipcRenderer } = window.electron;
    ipcRenderer.invoke('google-set-auth-client', getConfig().publication.googlecal, settings ? settings.googlecal : null);
}

export function setCalendarClient() {
    const { ipcRenderer } = window.electron;
    ipcRenderer.invoke('google-set-calendar-client');
}

export function authorize() {
    return async () => {
        setAuthClient();

        const { ipcRenderer } = window.electron;
        const url = await ipcRenderer.invoke('google-generate-auth-url');
        openExternal(url);
    };
}

export function createToken(code) {
    logger.debug('Create token', code);

    return async dispatch => {
        setAuthClient();

        const { ipcRenderer } = window.electron;
        const tokens = await ipcRenderer.invoke('google-get-tokens', code);

        await dispatch(updateSettings({
            googlecal: {
                tokens
            }
        }));
    };
}