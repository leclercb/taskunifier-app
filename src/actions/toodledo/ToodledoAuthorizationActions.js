import moment from 'moment';
import qs from 'qs';
import uuid from 'uuid';
import { sendRequest } from 'actions/RequestActions';
import { updateSettings } from 'actions/SettingActions';
import { getConfig } from 'config/Config';
import { getSettings } from 'selectors/SettingSelectors';
import { getAppVersion } from 'utils/VersionUtils';

export function authorize() {
    return async () => {
        const params = {
            response_type: 'code',
            client_id: getConfig().toodledo.username,
            state: uuid(),
            scope: 'basic tasks notes lists write'
        };

        const url = `https://api.toodledo.com/3/account/authorize.php?${qs.stringify(params)}`;

        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('open-external', url);
    };
}

export function createToken(code) {
    console.debug('createToken', code);

    return async (dispatch, getState) => {
        const { ipcRenderer } = window.require('electron');
        const settings = getSettings(getState());

        const result = await sendRequest(
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/account/token.php',
                auth: {
                    username: getConfig().toodledo.username,
                    password: getConfig().toodledo.password
                },
                data: {
                    grant_type: 'authorization_code',
                    code,
                    vers: getAppVersion(),
                    device: ipcRenderer.sendSync('get-os-platform')
                }
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
    console.debug('refreshToken');

    return async (dispatch, getState) => {
        const { ipcRenderer } = window.require('electron');
        const settings = getSettings(getState());

        const result = await sendRequest(
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/account/token.php',
                auth: {
                    username: getConfig().toodledo.username,
                    password: getConfig().toodledo.password
                },
                data: {
                    grant_type: 'refresh_token',
                    refresh_token: settings.toodledo.refreshToken,
                    vers: getAppVersion(),
                    device: ipcRenderer.sendSync('get-os-platform')
                }
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