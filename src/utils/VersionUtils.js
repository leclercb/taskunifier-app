import React from 'react';
import { Button, notification } from 'antd';
import { sendRequest } from 'actions/RequestActions';
import { getConfig } from 'config/Config';
import { compareVersions } from 'utils/CompareUtils';
import { openExternalLink } from 'utils/ElectronUtils';

export function getAppVersion() {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.sendSync('get-version');
}

export function downloadVersion() {
    openExternalLink(getConfig().downloadUrl);
}

export async function getLatestVersion(settings) {
    const result = await sendRequest(
        {
            method: 'GET',
            url: getConfig().latestReleaseUrl,
            responseType: 'text'
        },
        settings);

    return result.data.name;
}

export async function checkLatestVersion(settings, quiet = false) {
    try {
        const latestVersion = await getLatestVersion(settings);
        const currentVersion = getAppVersion();

        if (quiet) {
            if (settings.checkLatestVersion === latestVersion) {
                return null;
            }
        }

        if (compareVersions(currentVersion, latestVersion) > 0) {
            notification.info({
                message: `A new version is available: ${latestVersion}`,
                description: (
                    <Button onClick={() => downloadVersion()}>
                        Click here to download it !
                    </Button>
                )
            });
        } else {
            if (!quiet) {
                notification.success({
                    message: 'You already have the latest version'
                });
            }
        }

        return latestVersion;
    } catch (error) {
        if (!quiet) {
            notification.error({
                message: 'An error occurred while checking for the latest version'
            });
        }

        return null;
    }
}