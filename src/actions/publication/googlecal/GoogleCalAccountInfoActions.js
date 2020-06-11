import { google } from 'googleapis';
import { setPublicationData } from 'actions/PublicationActions';
import { getClient } from 'actions/publication/googlecal/GoogleCalAuthorizationActions';
import { getSettings } from 'selectors/SettingSelectors';
import logger from 'utils/LogUtils';

export function getGoogleCalAccountInfo() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        const client = getClient(settings);

        const profile = google.oauth2({
            version: 'v2',
            auth: client
        });

        const result = await profile.userinfo.get();

        logger.debug('Get account info', result.data);

        await dispatch(setPublicationData('googlecal', {
            accountInfo: result.data
        }));
    };
}