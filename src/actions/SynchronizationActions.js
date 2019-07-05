import moment from 'moment';
import uuid from 'uuid';
import { updateSettings } from 'actions/SettingActions';
import { updateProcess } from 'actions/ThreadActions';
import { getSettings } from 'selectors/SettingSelectors';
import { refreshToken } from 'actions/toodledo/Authorization';
import { synchronizeFolders } from 'actions/toodledo/Folders';
import { getAccountInfo } from 'actions/toodledo/AccountInfo';

export function updateToodledoData(data) {
    return async dispatch => {
        dispatch({
            type: 'UPDATE_TOODLEDO_DATA',
            data
        });
    };
}

export function synchronize() {
    return async (dispatch, getState) => {
        const processId = uuid();

        try {
            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: 'Synchronize with Toodledo',
                notify: true
            }));

            const settings = getSettings(getState());

            if (settings.toodledo && settings.toodledo.accessToken && settings.toodledo.refreshToken) {
                const accessTokenCreationDate = moment(settings.toodledo.accessTokenCreationDate);
                const expirationDate = accessTokenCreationDate.add(settings.toodledo.accessTokenExpiresIn, 'seconds');

                if (moment().diff(expirationDate, 'seconds') > -60) {
                    await dispatch(refreshToken());
                }
            } else {
                throw new Error('You are not connected to Toodledo');
            }

            await dispatch(getAccountInfo());

            await dispatch(synchronizeFolders());

            await dispatch(updateSettings({
                lastSynchronizationDate: moment().toISOString()
            }));

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));
        } catch (error) {
            if (error.response && error.response.data) {
                console.error(error.response.data);
            }

            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
            }));

            throw error;
        }
    };
}