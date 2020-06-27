import moment from 'moment';
import qs from 'qs';
import { v4 as uuid } from 'uuid';
import { sendRequest } from 'actions/RequestActions';
import { updateSettings } from 'actions/SettingActions';
import { getConfig } from 'config/Config';
import { getSettings } from 'selectors/SettingSelectors';
import { getAppVersion, getPlatform, openExternalLink } from 'utils/ElectronUtils';
import logger from 'utils/LogUtils';

export function authorize() {
    return async () => {
        const params = {
            response_type: 'code',
            client_id: getConfig().synchronization.toodledo.clientId,
            state: uuid(),
            scope: 'basic tasks notes lists write'
        };

        const url = `https://api.toodledo.com/3/account/authorize.php?${qs.stringify(params)}`;

        openExternalLink(url);
    };
}

export function createToken(code) {
    logger.debug('Create token', code);

    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        const result = await sendRequest(
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: 'https://api.toodledo.com/3/account/token.php',
                auth: {
                    username: getConfig().synchronization.toodledo.clientId,
                    password: getConfig().synchronization.toodledo.clientSecret
                },
                data: qs.stringify({
                    grant_type: 'authorization_code',
                    code,
                    vers: getAppVersion(),
                    device: getPlatform()
                })
            },
            settings);

        await dispatch(updateSettings({
            toodledo: {
                accessToken: result.data.access_token,
                accessTokenCreationDate: moment().toISOString(),
                accessTokenExpiresIn: result.data.expires_in,
                refreshToken: result.data.refresh_token
            }
        }));
    };
}

export function refreshToken() {
    logger.debug('Refresh token');

    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        const result = await sendRequest(
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: 'https://api.toodledo.com/3/account/token.php',
                auth: {
                    username: getConfig().synchronization.toodledo.clientId,
                    password: getConfig().synchronization.toodledo.clientSecret
                },
                data: qs.stringify({
                    grant_type: 'refresh_token',
                    refresh_token: settings.toodledo.refreshToken,
                    vers: getAppVersion(),
                    device: getPlatform()
                })
            },
            settings);

        await dispatch(updateSettings({
            toodledo: {
                accessToken: result.data.access_token,
                accessTokenCreationDate: moment().toISOString(),
                accessTokenExpiresIn: result.data.expires_in,
                refreshToken: result.data.refresh_token
            }
        }));
    };
}