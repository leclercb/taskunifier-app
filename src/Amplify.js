import Amplify from 'aws-amplify';
import { getConfig } from 'config/Config';

export function configure() {
    Amplify.configure({
        Auth: {
            region: getConfig().auth.region,
            userPoolId: getConfig().auth.userPoolId,
            userPoolWebClientId: getConfig().auth.userPoolWebClientId,
            mandatorySignIn: false,
            cookieStorage: {
                domain: getConfig().auth.cookieStorage.domain,
                path: '/',
                expires: 365,
                secure: getConfig().auth.cookieStorage.secure
            },
            authenticationFlowType: 'USER_PASSWORD_AUTH'
        }
    });
}