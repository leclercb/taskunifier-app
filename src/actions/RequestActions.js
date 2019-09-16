import axios from 'axios';
import { getConfig } from 'config/Config';

export function sendRequest(config, settings = {}) {
    if (process.env.REACT_APP_MODE === 'react') {
        return axios(config);
    }

    const electron = window.require('electron');
    const electronAxios = electron.remote.require('axios');

    if (!settings.proxyEnabled ||
        !settings.proxyHost ||
        !settings.proxyPort) {
        return electronAxios(config);
    }

    const httpsProxyAgent = electron.remote.require('https-proxy-agent');
    const { protocol } = new URL(config.url);

    if (protocol === 'https:') {
        return electronAxios.create({
            httpsAgent: new httpsProxyAgent({
                host: settings.proxyHost,
                port: settings.proxyPort,
                auth: `${settings.proxyUsername}:${settings.proxyPassword}`
            })
        })(config);
    }

    return electronAxios.create({
        proxy: {
            host: settings.proxyHost,
            port: settings.proxyPort,
            auth: {
                username: settings.proxyUsername,
                password: settings.proxyPassword
            }
        }
    })(config);
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