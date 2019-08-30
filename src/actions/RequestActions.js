import Constants from 'constants/Constants';
import axios from 'axios';

export function sendRequest(config, settings = {}) {
    if (process.env.REACT_APP_MODE !== 'electron' ||
        !settings.proxyEnabled ||
        !settings.proxyHost ||
        !settings.proxyPort) {
        return axios(config);
    }

    const electron = window.require('electron');
    const electronAxios = electron.remote.require('axios');
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

export function testConnection(settings) {
    return sendRequest(
        {
            method: 'GET',
            url: Constants.connectionTestUrl,
            responseType: 'text'
        },
        settings);
}

export async function getLatestVersion(settings) {
    const result = await sendRequest(
        {
            method: 'GET',
            url: Constants.versionUrl,
            responseType: 'text'
        },
        settings);

    return result.data.number;
}