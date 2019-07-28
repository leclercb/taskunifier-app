import { Buffer } from 'buffer';

const PUBLIC_KEY = process.env.REACT_APP_LICENSE_PUBLIC_KEY;

export function verifyLicense(license) {
    if (process.env.REACT_APP_MODE !== 'electron') {
        return true;
    }

    const electron = window.require('electron');
    const crypto = electron.remote.require('crypto');

    if (!license || license.length <= 512) {
        return null;
    }

    const signature = license.substr(0, 512);
    const message = license.substr(512);

    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(message);

    if (verifier.verify(PUBLIC_KEY, signature, 'hex')) {
        const content = Buffer.from(message, 'hex').toString();

        try {
            return JSON.parse(content);
        } catch (e) {
            return null;
        }
    } else {
        return null;
    }
}