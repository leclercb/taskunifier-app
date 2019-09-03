import { sendRequest } from 'actions/RequestActions';
import { checkResult } from 'actions/synchronization/taskunifier/ExceptionHandler';
import { setSynchronizationData } from 'actions/SynchronizationActions';
import { getSettings } from 'selectors/SettingSelectors';
import { getConfig } from 'config/Config';

export function getTaskUnifierAccountInfo() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'POST',
                url: `${getConfig().apiUrl}/v1/users/current`
            },
            settings);

        checkResult(result);

        await dispatch(setSynchronizationData('taskunifier', {
            accountInfo: result.data
        }));
    };
}