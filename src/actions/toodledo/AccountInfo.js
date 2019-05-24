import { sendRequest } from 'actions/RequestActions';
import { getSettings } from 'selectors/SettingSelectors';

export function getAccountInfo(accessToken) {
    return (dispatch, getState) => {
        return sendRequest(
            getSettings(getState()),
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/account/get.php',
                data: {
                    'access_token': accessToken
                }
            });
    };
}