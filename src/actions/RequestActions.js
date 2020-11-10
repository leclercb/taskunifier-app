import axios from 'axios';
import { getConfig } from 'config/Config';
import {
    axios as electronAxios,
    axiosCreate as electronAxiosCreate
} from 'utils/ElectronIpc';

export function sendRequest(config, settings = {}) {
    if (process.env.REACT_APP_MODE === 'react') {
        return axios(config);
    }

    if (!settings.proxyEnabled ||
        !settings.proxyHost ||
        !settings.proxyPort) {
        return electronAxios(config);
    }

    const { protocol } = new URL(config.url);

    if (protocol === 'https:') {
        return electronAxiosCreate(config, {}, {
            host: settings.proxyHost,
            port: settings.proxyPort,
            auth: `${settings.proxyUsername}:${settings.proxyPassword}`
        });
    }

    return electronAxiosCreate(config, {
        proxy: {
            host: settings.proxyHost,
            port: settings.proxyPort,
            auth: {
                username: settings.proxyUsername,
                password: settings.proxyPassword
            }
        }
    });
}

export async function testConnection(settings) {
    await sendRequest(
        {
            method: 'GET',
            url: getConfig().connectionTestUrl,
            responseType: 'text'
        },
        settings);
}