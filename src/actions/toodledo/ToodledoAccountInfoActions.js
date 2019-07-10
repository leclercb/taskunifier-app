import { sendRequest } from 'actions/RequestActions';
import { checkResult } from 'actions/toodledo/ExceptionHandler';
import { updateToodledoData } from 'actions/toodledo/ToodledoSynchronizationActions';
import { getSettings } from 'selectors/SettingSelectors';

export function getAccountInfo() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        const result = await sendRequest(
            settings,
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/account/get.php',
                params: {
                    access_token: settings.toodledo.accessToken
                }
            });

        checkResult(result);

        await dispatch(updateToodledoData({
            accountInfo: result.data
        }));
    };
}