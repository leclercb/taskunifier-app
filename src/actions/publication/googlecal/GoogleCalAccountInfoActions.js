import { setPublicationData } from 'actions/PublicationActions';
import { setAuthClient } from 'actions/publication/googlecal/GoogleCalAuthorizationActions';
import { getSettings } from 'selectors/SettingSelectors';
import logger from 'utils/LogUtils';

export function getGoogleCalAccountInfo() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());
        setAuthClient(settings);

        const { ipcRenderer } = window.electron;
        const userInfo = await ipcRenderer.invoke('google-get-user-info');

        logger.debug('Get account info', userInfo);

        await dispatch(setPublicationData('googlecal', {
            accountInfo: userInfo
        }));
    };
}