import React from 'react';
import { Button, Modal } from 'antd';
import { getTaskUnifierAccountInfo } from 'actions/synchronization/taskunifier/TaskUnifierAccountInfoActions';
import { resetDataForTaskUnifierSynchronization, synchronizeWithTaskUnifier } from 'actions/synchronization/taskunifier/TaskUnifierSynchronizationActions';
import { getToodledoAccountInfo } from 'actions/synchronization/toodledo/ToodledoAccountInfoActions';
import { resetDataForToodledoSynchronization, synchronizeWithToodledo } from 'actions/synchronization/toodledo/ToodledoSynchronizationActions';
import { updateSettings } from 'actions/SettingActions';
import { getSettings } from 'selectors/SettingSelectors';
import { isSynchronizing } from 'selectors/SynchronizationSelectors';

export function setSynchronizing(synchronizing) {
    return async dispatch => {
        dispatch({
            type: 'SET_SYNCHRONIZING',
            synchronizing
        });
    };
}

export function setSynchronizationData(application, data) {
    return async dispatch => {
        dispatch({
            type: 'SET_SYNCHRONIZATION_DATA',
            application,
            data
        });
    };
}

export function getAccountInfo() {
    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        switch (settings.synchronizationApp) {
            case 'taskunifier':
                await dispatch(getTaskUnifierAccountInfo());
                break;
            case 'toodledo':
                await dispatch(getToodledoAccountInfo());
                break;
            default:
                throw new Error('No synchronization application defined');
        }
    };
}

export async function selectSynchronizationApp() {
    return new Promise(resolve => {
        let synchronizationApp = null;

        Modal.confirm({
            title: 'Select a synchronization service',
            content: (
                <React.Fragment>
                    <Button
                        onClick={() => synchronizationApp = 'taskunifier'}
                        style={{ width: 200, height: 200 }}>
                        <img
                            alt='taskunifier'
                            src='resources/images/synchronization/taskunifier.png'
                            style={{ width: 100, height: 100, marginBottom: 25 }} />
                        <br />
                        TaskUnifier
                    </Button>
                    <Button
                        onClick={() => synchronizationApp = 'toodledo'}
                        style={{ width: 200, height: 200, marginLeft: 25 }}>
                        <img
                            alt='toodledo'
                            src='resources/images/synchronization/toodledo.png'
                            style={{ width: 100, height: 100, marginBottom: 25 }} />
                        <br />
                        Toodledo
                    </Button>
                </React.Fragment>
            ),
            okText: 'Select',
            onOk: () => {
                resolve(synchronizationApp);
            },
            onCancel: () => {
                resolve(null);
            },
            width: 600
        });
    });
}

export function synchronize() {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            const settings = getSettings(state);

            if (isSynchronizing(state)) {
                return;
            }

            await dispatch(setSynchronizing(true));

            let synchronizationApp = settings.synchronizationApp;

            if (!synchronizationApp) {
                synchronizationApp = await selectSynchronizationApp();

                if (!synchronizationApp) {
                    return;
                }

                await dispatch(updateSettings({
                    synchronizationApp
                }));
            }

            switch (synchronizationApp) {
                case 'taskunifier':
                    await dispatch(synchronizeWithTaskUnifier());
                    break;
                case 'toodledo':
                    await dispatch(synchronizeWithToodledo());
                    break;
                default:
                    throw new Error('No synchronization application defined');
            }
        } finally {
            await dispatch(setSynchronizing(false));
        }
    };
}

export function resetDataForSynchronization() {
    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        let synchronizationApp = settings.synchronizationApp;

        if (!synchronizationApp) {
            synchronizationApp = await selectSynchronizationApp();

            if (!synchronizationApp) {
                return;
            }

            await dispatch(updateSettings({
                synchronizationApp
            }));
        }

        switch (synchronizationApp) {
            case 'taskunifier':
                await dispatch(resetDataForTaskUnifierSynchronization());
                break;
            case 'toodledo':
                await dispatch(resetDataForToodledoSynchronization());
                break;
            default:
                throw new Error('No synchronization application defined');
        }
    };
}