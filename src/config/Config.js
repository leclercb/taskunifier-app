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
        cloudUrl: 'http://localhost:2100/cloud',
        appUrl: 'http://localhost:2100/app',
        downloadUrl: 'http://localhost:2100/app',
        maintenanceUrl: 'http://localhost:2100/maintenance',
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
            publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4tP95NhDLLMaO7qNfWU5\nHGrnJoVd7MxS0Hc4svmyv4GPa9FBVZPtiQwVOm4OpkFLBxIxr/c3lxIecar7a53R\nepcoTLs1qaZeuBwTruOiHHbkbwA8u/ntrJIahtqMLZ9HH8yLJaymC2OLjaT18hcZ\n8W7n89fSR262ZZcd0joY4eTpF/sEnCZpccpBGKEwVHtOFyna+E+XzgQrSFe+0qEz\nPIU9P8gGDmuBm8xXx6w8OwKSM3jAQ01ja7l5epsrNWXD8z3PJrOom5cigiu8l1Sk\nJJoWoH5gNUNOqMqeH4mpCbfn6YF69aNAVrZcXkB+rkGFdgdQrQXWyyJufFKviSyd\niwIDAQAB\n-----END PUBLIC KEY-----'
        },
        synchronization: {
            taskunifier: {
                clientId: process.env.REACT_APP_TASKUNIFIER_CLIENT_ID,
                clientSecret: process.env.REACT_APP_TASKUNIFIER_CLIENT_SECRET,
                oauthUri: 'https://hosted-auth-dev.taskunifier.app',
                redirectUri: 'https://www-dev.taskunifier.app/code'
            },
            toodledo: {
                clientId: process.env.REACT_APP_TOODLEDO_CLIENT_ID,
                clientSecret: process.env.REACT_APP_TOODLEDO_CLIENT_SECRET
            }
        }
    },
    dev: {
        apiUrl: 'https://api-dev.taskunifier.app',
        authUrl: 'https://auth-dev.taskunifier.app',
        cloudUrl: 'https://www-dev.taskunifier.app/cloud',
        appUrl: 'https://www-dev.taskunifier.app/app',
        downloadUrl: 'https://www-dev.taskunifier.app/app',
        maintenanceUrl: 'https://www-dev.taskunifier.app/maintenance',
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
            publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4tP95NhDLLMaO7qNfWU5\nHGrnJoVd7MxS0Hc4svmyv4GPa9FBVZPtiQwVOm4OpkFLBxIxr/c3lxIecar7a53R\nepcoTLs1qaZeuBwTruOiHHbkbwA8u/ntrJIahtqMLZ9HH8yLJaymC2OLjaT18hcZ\n8W7n89fSR262ZZcd0joY4eTpF/sEnCZpccpBGKEwVHtOFyna+E+XzgQrSFe+0qEz\nPIU9P8gGDmuBm8xXx6w8OwKSM3jAQ01ja7l5epsrNWXD8z3PJrOom5cigiu8l1Sk\nJJoWoH5gNUNOqMqeH4mpCbfn6YF69aNAVrZcXkB+rkGFdgdQrQXWyyJufFKviSyd\niwIDAQAB\n-----END PUBLIC KEY-----'
        },
        synchronization: {
            taskunifier: {
                clientId: process.env.REACT_APP_TASKUNIFIER_CLIENT_ID,
                clientSecret: process.env.REACT_APP_TASKUNIFIER_CLIENT_SECRET,
                oauthUri: 'https://hosted-auth-dev.taskunifier.app',
                redirectUri: 'https://www-dev.taskunifier.app/code'
            },
            toodledo: {
                clientId: process.env.REACT_APP_TOODLEDO_CLIENT_ID,
                clientSecret: process.env.REACT_APP_TOODLEDO_CLIENT_SECRET
            }
        }
    },
    prod: {
        apiUrl: 'https://api.taskunifier.app',
        authUrl: 'https://auth.taskunifier.app',
        cloudUrl: 'https://www.taskunifier.app/cloud',
        appUrl: 'https://www.taskunifier.app/app',
        downloadUrl: 'https://www.taskunifier.app/app',
        maintenanceUrl: 'https://www.taskunifier.app/maintenance',
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
            publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAocK4w+shPGvQsDaR8NTn\nRlQy/u7VpzPWVtjTOE+BXNGtlP+NqTmR5kTygr5p83ntcGloL1Qdy7OtF1wtwlBN\n8c9HMHgQcSM8YUkiziCirU2cHy237xtPnIiHN5ygSqsS+8Pyvy7Uhmb/6HXZvUCi\nQCTZsfcm5JxOcbbSLf+rxLIcQRkiSmhLUWoockeN/valHJnd93nHlKyjWKAInY2S\n1YOeXpwKIW8a+Uy3buc1IxnJIM426wk9X4EcH6UL1+0P/vsNG8HkHJNjMRJKoadx\nD9S/Br/isbgm2aVGkNPVq3p2VwxiTFlui1pfRXcgLAKCxv5xvcTL805m8sbWH3K0\nzQIDAQAB\n-----END PUBLIC KEY-----'
        },
        synchronization: {
            taskunifier: {
                clientId: process.env.REACT_APP_TASKUNIFIER_CLIENT_ID,
                clientSecret: process.env.REACT_APP_TASKUNIFIER_CLIENT_SECRET,
                oauthUri: 'https://hosted-auth.taskunifier.app',
                redirectUri: 'https://www.taskunifier.app/code'
            },
            toodledo: {
                clientId: process.env.REACT_APP_TOODLEDO_CLIENT_ID,
                clientSecret: process.env.REACT_APP_TOODLEDO_CLIENT_SECRET
            }
        }
    }
};

export function getConfig() {
    return {
        ...config.common,
        ...config[process.env.REACT_APP_STAGE]
    };
}