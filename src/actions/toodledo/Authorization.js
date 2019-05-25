import queryString from 'query-string';
import uuid from 'uuid';
import { sendRequest } from 'actions/RequestActions';
import { getSettings } from 'selectors/SettingSelectors';
import { getAppVersion } from 'utils/VersionUtils';

const { ipcRenderer } = window.require('electron');

export function authorize() {
    return () => {
        const params = {
            response_type: 'code',
            client_id: 'taskunifier2',
            state: uuid(),
            scope: 'basic tasks notes lists write'
        };

        const url = `https://api.toodledo.com/3/account/authorize.php?${queryString.stringify(params)}`;

        ipcRenderer.send('open-external', url);

        return Promise.resolve();
    };
}

export function getToken(code) {
    return (dispatch, getState) => {
        return sendRequest(
            getSettings(getState()),
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/account/token.php',
                auth: {
                    username: 'taskunifier2',
                    password: 'secret'
                },
                data: {
                    grant_type: 'authorization_code',
                    code,
                    vers: getAppVersion(),
                    device: ipcRenderer.sendSync('get-os-platform')
                }
            });
    };
}

export function getRefreshedToken(refreshToken) {
    return (dispatch, getState) => {
        return sendRequest(
            getSettings(getState()),
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/account/token.php',
                auth: {
                    username: 'taskunifier2',
                    password: 'secret'
                },
                data: {
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    vers: getAppVersion(),
                    device: ipcRenderer.sendSync('get-os-platform')
                }
            });
    };
}