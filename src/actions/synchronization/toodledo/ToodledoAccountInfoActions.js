import qs from 'qs';
import { sendRequest } from 'actions/RequestActions';
import { checkResult } from 'actions/synchronization/toodledo/ExceptionHandler';
import { setSynchronizationData } from 'actions/SynchronizationActions';
import { getSettings } from 'selectors/SettingSelectors';

export function getToodledoAccountInfo() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        const result = await sendRequest(
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: 'https://api.toodledo.com/3/account/get.php',
                data: qs.stringify({
                    access_token: settings.toodledo.accessToken
                })
            },
            settings);

        console.debug('getToodledoAccountInfo', result);

        checkResult(result);

        await dispatch(setSynchronizationData('toodledo', {
            accountInfo: result.data
        }));
    };
}