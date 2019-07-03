import uuid from 'uuid';
import moment from 'moment';
import { _loadData, _saveData } from 'actions/AppActions';
import { updateProcess } from 'actions/ThreadActions';
import { addRemoteFolder } from 'actions/toodledo/Folders';
import { getFolders } from "selectors/FolderSelectors";
import { getSettings } from 'selectors/SettingSelectors';
import { filterByVisibleState } from "utils/CategoryUtils";
import { setFolders } from 'actions/FolderActions';

export function updateToodledoData(data) {
    return async dispatch => {
        dispatch({
            type: 'UPDATE_TOODLEDO_DATA',
            data
        });
    };
}

export function synchronize() {
    return async (dispatch) => {
        await dispatch(synchronizeFolders());
    };
}

export function synchronizeFolders() {
    return async (dispatch, getState) => {
        const processId = uuid();

        try {
            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: 'Synchronize with Toodledo',
                notify: true
            }));

            const state = getState();
            const settings = getSettings(state);
            const folders = getFolders(state);

            const promises = filterByVisibleState(folders)
                .filter(folder => !folder.refIds.toodledo)
                .map(folder => addRemoteFolder(settings, folder));

            await Promise.all(promises);

            await dispatch(setFolders(folders));

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
            }));

            // throw error;
        }
    };
}