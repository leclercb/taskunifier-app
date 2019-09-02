const config = {
    common: {
        appItemSku: 'tu-app-pro-1',
        cloudItemSku: 'tu-cloud-pro-1y',
        connectionTestUrl: 'http://www.google.com',
        latestReleaseUrl: 'https://api.github.com/repos/leclercb/taskunifier-app/releases/latest'
    },
    local: {
        apiUrl: 'http://localhost:2000',
        authUrl: 'http://localhost:2300',
        purchaseUrl: 'http://localhost:2100/app',
        downloadUrl: 'http://localhost:2100/app',
        auth: {
            region: 'eu-west-1',
            userPoolId: process.env.REACT_APP_AUTH_USERPOOLID,
            userPoolWebClientId: process.env.REACT_APP_AUTH_USERPOOLWEBCLIENTID,
            cookieStorage: {
                domain: 'localhost',
                secure: false
            }
        },
        license: {
            publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArvN3lkMNEgwaTS6yz6y1\n6coi6Jfakg01rYNeOb6x2kv21OEm0Mhq5Q5/Lw+Os2kD30j50IYGvrAB0L7U3kYW\nItVjPnsWqfz81WqzfGRpmLWjnCTdoKyS8uph3F0jaSsrhi0+VsLgFz8p61G5USP7\nE5FDiVgCih5gPPfUTVNk6uIMryLiQpVKsaHvVr/bC7DX0UuKT2PCut88mkARxn51\nCTrEr5aHXxv3e2PwOmdzDTaThjmjjhpwkR8LKuFb71B4e+cJukYOoyJsTa2xqiqf\nzpOv9IGF0By1PJySxY+KZtq/elnhDcct2S28sIh5+3l2fEDz6e8DFLNnHdJ9ofWT\nGQIDAQAB\n-----END PUBLIC KEY-----'
        },
        toodledo: {
            username: process.env.REACT_APP_TOODLEDO_USERNAME,
            password: process.env.REACT_APP_TOODLEDO_PASSWORD
        }
    },
    dev: {
        apiUrl: 'https://api-dev.taskunifier.app',
        authUrl: 'https://auth-dev.taskunifier.app',
        purchaseUrl: 'https://www-dev.taskunifier.app/app',
        downloadUrl: 'https://www-dev.taskunifier.app/app',
        auth: {
            region: 'eu-west-1',
            userPoolId: process.env.REACT_APP_AUTH_USERPOOLID,
            userPoolWebClientId: process.env.REACT_APP_AUTH_USERPOOLWEBCLIENTID,
            cookieStorage: {
                domain: '.taskunifier.app',
                secure: true
            }
        },
        license: {
            publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArvN3lkMNEgwaTS6yz6y1\n6coi6Jfakg01rYNeOb6x2kv21OEm0Mhq5Q5/Lw+Os2kD30j50IYGvrAB0L7U3kYW\nItVjPnsWqfz81WqzfGRpmLWjnCTdoKyS8uph3F0jaSsrhi0+VsLgFz8p61G5USP7\nE5FDiVgCih5gPPfUTVNk6uIMryLiQpVKsaHvVr/bC7DX0UuKT2PCut88mkARxn51\nCTrEr5aHXxv3e2PwOmdzDTaThjmjjhpwkR8LKuFb71B4e+cJukYOoyJsTa2xqiqf\nzpOv9IGF0By1PJySxY+KZtq/elnhDcct2S28sIh5+3l2fEDz6e8DFLNnHdJ9ofWT\nGQIDAQAB\n-----END PUBLIC KEY-----'
        },
        toodledo: {
            username: process.env.REACT_APP_TOODLEDO_USERNAME,
            password: process.env.REACT_APP_TOODLEDO_PASSWORD
        }
    },
    prod: {
        apiUrl: 'https://api.taskunifier.app',
        authUrl: 'https://auth.taskunifier.app',
        purchaseUrl: 'https://www.taskunifier.app/app',
        downloadUrl: 'https://www.taskunifier.app/app',
        auth: {
            region: 'eu-west-1',
            userPoolId: process.env.REACT_APP_AUTH_USERPOOLID,
            userPoolWebClientId: process.env.REACT_APP_AUTH_USERPOOLWEBCLIENTID,
            cookieStorage: {
                domain: '.taskunifier.app',
                secure: true
            }
        },
        license: {
            publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArvN3lkMNEgwaTS6yz6y1\n6coi6Jfakg01rYNeOb6x2kv21OEm0Mhq5Q5/Lw+Os2kD30j50IYGvrAB0L7U3kYW\nItVjPnsWqfz81WqzfGRpmLWjnCTdoKyS8uph3F0jaSsrhi0+VsLgFz8p61G5USP7\nE5FDiVgCih5gPPfUTVNk6uIMryLiQpVKsaHvVr/bC7DX0UuKT2PCut88mkARxn51\nCTrEr5aHXxv3e2PwOmdzDTaThjmjjhpwkR8LKuFb71B4e+cJukYOoyJsTa2xqiqf\nzpOv9IGF0By1PJySxY+KZtq/elnhDcct2S28sIh5+3l2fEDz6e8DFLNnHdJ9ofWT\nGQIDAQAB\n-----END PUBLIC KEY-----'
        },
        toodledo: {
            username: process.env.REACT_APP_TOODLEDO_USERNAME,
            password: process.env.REACT_APP_TOODLEDO_PASSWORD
        }
    }
};

export function getConfig() {
    return {
        ...config.common,
        ...config[process.env.REACT_APP_STAGE]
    };
}