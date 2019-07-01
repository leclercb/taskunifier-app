import { sendRequest } from 'actions/RequestActions';
import { updateToodledoData } from 'actions/SynchronizationActions';
import { getSettings } from 'selectors/SettingSelectors';
import { getRefreshedToken } from 'actions/toodledo/Authorization';

export function getAccountInfo() {
    return async (dispatch, getState) => {
        try {
            const settings = getSettings(getState());

            const result = await sendRequest(
                settings,
                {
                    method: 'POST',
                    url: 'https://api.toodledo.com/3/account/get.php',
                    params: {
                        'access_token': settings.toodledo.accessToken
                    }
                });

            await dispatch(updateToodledoData({
                accountInfo: result.data
            }));
        } catch (error) {
            console.log(error.response);
            if (error.response && error.response.status === 401) {
                await dispatch(getRefreshedToken());
            }
        }
    };
}