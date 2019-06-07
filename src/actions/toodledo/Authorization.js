import moment from 'moment';
import qs from 'qs';
import uuid from 'uuid';
import { sendRequest } from 'actions/RequestActions';
import { updateSettings } from 'actions/SettingActions';
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

        const url = `https://api.toodledo.com/3/account/authorize.php?${qs.stringify(params)}`;

        ipcRenderer.send('open-external', url);

        return Promise.resolve();
    };
}

export function getToken(code) {
    return (dispatch, getState) => {
        const settings = getSettings(getState());

        return sendRequest(
            settings,
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/account/token.php',
                auth: {
                    username: 'taskunifier2',
                    password: '***REMOVED***'
                },
                data: {
                    grant_type: 'authorization_code',
                    code,
                    vers: getAppVersion(),
                    device: ipcRenderer.sendSync('get-os-platform')
                }
            }).then(result => {
                return dispatch(updateSettings({
                    toodledo: {
                        accessToken: result.data.access_token,
                        accessTokenCreationDate: moment().toISOString(),
                        accessTokenExpiresIn: result.data.expires_in,
                        refreshToken: result.data.refresh_token
                    }
                }));
            });
    };
}

export function getRefreshedToken() {
    return (dispatch, getState) => {
        const settings = getSettings(getState());

        return sendRequest(
            settings,
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/account/token.php',
                auth: {
                    username: 'taskunifier2',
                    password: '***REMOVED***'
                },
                data: {
                    grant_type: 'refresh_token',
                    refresh_token: settings.toodledo.refreshToken,
                    vers: getAppVersion(),
                    device: ipcRenderer.sendSync('get-os-platform')
                }
            }).then(result => {
                return dispatch(updateSettings({
                    toodledo: {
                        accessToken: result.data.access_token,
                        accessTokenCreationDate: moment().toISOString(),
                        accessTokenExpiresIn: result.data.expires_in,
                        refreshToken: result.data.refresh_token
                    }
                }));
            });
    };
}