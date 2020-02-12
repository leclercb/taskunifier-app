import { google } from 'googleapis';
import { setPublicationData } from 'actions/PublicationActions';
import { getClient } from 'actions/publication/googlecal/GoogleCalAuthorizationActions';
import { getSettings } from 'selectors/SettingSelectors';

export function getGoogleCalAccountInfo() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        const profile = google.oauth2({
            auth: getClient(settings),
            version: 'v2'
        });

        const result = await profile.userinfo.get();

        console.debug('getGoogleCalAccountInfo', result);

        await dispatch(setPublicationData('googlecal', {
            accountInfo: result.data
        }));
    };
}