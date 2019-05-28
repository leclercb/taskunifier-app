import { Buffer } from 'buffer';

const electron = window.require('electron');
const crypto = electron.remote.require('crypto');

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArvN3lkMNEgwaTS6yz6y1
6coi6Jfakg01rYNeOb6x2kv21OEm0Mhq5Q5/Lw+Os2kD30j50IYGvrAB0L7U3kYW
ItVjPnsWqfz81WqzfGRpmLWjnCTdoKyS8uph3F0jaSsrhi0+VsLgFz8p61G5USP7
E5FDiVgCih5gPPfUTVNk6uIMryLiQpVKsaHvVr/bC7DX0UuKT2PCut88mkARxn51
CTrEr5aHXxv3e2PwOmdzDTaThjmjjhpwkR8LKuFb71B4e+cJukYOoyJsTa2xqiqf
zpOv9IGF0By1PJySxY+KZtq/elnhDcct2S28sIh5+3l2fEDz6e8DFLNnHdJ9ofWT
GQIDAQAB
-----END PUBLIC KEY-----`;

export function verifyLicense(license) {
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
            return JSON.parse(content)
        } catch (e) {
            return null;
        }
    } else {
        return null;
    }
}