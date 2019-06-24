import Constants from 'constants/Constants';

const electron = window.require('electron');
const axios = electron.remote.require('axios');
const httpsProxyAgent = electron.remote.require('https-proxy-agent');

export function sendRequest(settings, config) {
    if (!settings.proxyEnabled || !settings.proxyHost || !settings.proxyPort) {
        return axios(config);
    }

    const { protocol } = new URL(config.url);

    if (protocol === 'https:') {
        return axios.create({
            httpsAgent: new httpsProxyAgent({
                host: settings.proxyHost,
                port: settings.proxyPort,
                auth: `${settings.proxyUsername}:${settings.proxyPassword}`
            })
        })(config);
    }

    return axios.create({
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
        settings,
        {
            method: 'GET',
            url: Constants.connectionTestUrl,
            responseType: 'text'
        });
}

export async function getLatestVersion(settings) {
    const result = await sendRequest(
        settings,
        {
            method: 'GET',
            url: Constants.versionUrl,
            responseType: 'text'
        });

    return result.data.number;
}