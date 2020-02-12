import { google } from 'googleapis';
import { updateSettings } from 'actions/SettingActions';
import { getConfig } from 'config/Config';
import { openExternalLink } from 'utils/ElectronUtils';

export function getClient(settings = null) {
    const client = new google.auth.OAuth2(
        getConfig().publication.googlecal.clientId,
        getConfig().publication.googlecal.clientSecret,
        getConfig().publication.googlecal.redirectUri
    );

    if (settings && settings.googlecal && settings.googlecal.tokens) {
        client.setCredentials(settings.googlecal.tokens);
    }

    return client;
}

export function authorize() {
    return async () => {
        const client = getClient();

        const url = client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/calendar']
        });

        openExternalLink(url);
    };
}

export function createToken(code) {
    console.debug('createToken', code);

    return async dispatch => {
        const client = getClient();

        const { tokens } = await client.getToken(code);

        await dispatch(updateSettings({
            googlecal: {
                tokens
            }
        }));
    };
}