import moment from 'moment';
import qs from 'qs';
import { sendRequest } from 'actions/RequestActions';
import { updateSettings } from 'actions/SettingActions';
import { getConfig } from 'config/Config';
import { getSettings } from 'selectors/SettingSelectors';
import { openExternalLink } from 'utils/ElectronUtils';

export function authorize() {
    return async () => {
        const params = {
            response_type: 'code',
            client_id: getConfig().synchronization.taskunifier.clientId,
            redirect_uri: getConfig().synchronization.taskunifier.redirectUri,
            scope: 'openid https://api.taskunifier.app/api.write'
        };

        const url = `${getConfig().synchronization.taskunifier.oauthUri}/login?${qs.stringify(params)}`;

        openExternalLink(url);
    };
}

export function createToken(code) {
    console.debug('createToken', code);

    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        const result = await sendRequest(
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: `${getConfig().synchronization.taskunifier.oauthUri}/oauth2/token`,
                auth: {
                    username: getConfig().synchronization.taskunifier.clientId,
                    password: getConfig().synchronization.taskunifier.clientSecret
                },
                data: qs.stringify({
                    grant_type: 'authorization_code',
                    redirect_uri: getConfig().synchronization.taskunifier.redirectUri,
                    code
                })
            },
            settings);

        await dispatch(updateSettings({
            taskunifier: {
                accessToken: result.data.access_token,
                accessTokenCreationDate: moment().toISOString(),
                accessTokenExpiresIn: result.data.expires_in,
                refreshToken: result.data.refresh_token
            }
        }));
    };
}

export function refreshToken() {
    console.debug('refreshToken');

    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        const result = await sendRequest(
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: `${getConfig().synchronization.taskunifier.oauthUri}/oauth2/token`,
                auth: {
                    username: getConfig().synchronization.taskunifier.clientId,
                    password: getConfig().synchronization.taskunifier.clientSecret
                },
                data: qs.stringify({
                    grant_type: 'refresh_token',
                    refresh_token: settings.taskunifier.refreshToken
                })
            },
            settings);

        await dispatch(updateSettings({
            taskunifier: {
                accessToken: result.data.access_token,
                accessTokenCreationDate: moment().toISOString(),
                accessTokenExpiresIn: result.data.expires_in,
                refreshToken: settings.taskunifier.refreshToken
            }
        }));
    };
}