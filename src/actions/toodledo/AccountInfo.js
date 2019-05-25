import { sendRequest } from 'actions/RequestActions';
import { updateToodledoData } from 'actions/SynchronizationActions';
import { getSettings } from 'selectors/SettingSelectors';

export function getAccountInfo() {
    return (dispatch, getState) => {
        const settings = getSettings(getState());

        return sendRequest(
            settings,
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/account/get.php',
                params: {
                    'access_token': settings.toodledo.accessToken
                }
            }).then(result => {
                return dispatch(updateToodledoData({
                    accountInfo: result.data
                }));
            });
    };
}