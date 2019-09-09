import { sendRequest } from 'actions/RequestActions';
import { setSynchronizationData } from 'actions/SynchronizationActions';
import { getConfig } from 'config/Config';
import { getSettings } from 'selectors/SettingSelectors';

export function getTaskUnifierAccountInfo() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'GET',
                url: `${getConfig().apiUrl}/v1/users/current`
            },
            settings);

        console.debug('getTaskUnifierAccountInfo', result);

        await dispatch(setSynchronizationData('taskunifier', {
            accountInfo: result.data
        }));
    };
}