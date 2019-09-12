import React from 'react';
import { Button, Modal } from 'antd';
import { updateSettings } from 'actions/SettingActions';
import { getSettings } from 'selectors/SettingSelectors';
import { isSynchronizing } from 'selectors/SynchronizationSelectors';
import { getSynchronizationApp, getSynchronizationApps } from 'utils/SynchronizationUtils';

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

        const app = getSynchronizationApp(settings.synchronizationApp);

        if (!app) {
            throw new Error('No synchronization application defined');
        }

        await dispatch(app.getAccountInfo());
    };
}

export async function selectSynchronizationApp() {
    return new Promise(resolve => {
        let synchronizationApp = null;

        Modal.confirm({
            title: 'Select a synchronization service',
            content: (
                <React.Fragment>
                    {getSynchronizationApps().map(app => (
                        <Button
                            key={app.id}
                            onClick={() => synchronizationApp = app.id}
                            style={{ width: 200, height: 200, margin: '0px 10px' }}>
                            <img
                                alt={app.label}
                                src={app.img}
                                style={{ width: 100, height: 100, marginBottom: 25 }} />
                            <br />
                            {app.label}
                        </Button>
                    ))}
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

            let { synchronizationApp } = settings;

            if (!synchronizationApp) {
                synchronizationApp = await selectSynchronizationApp();

                if (!synchronizationApp) {
                    return;
                }

                await dispatch(updateSettings({
                    synchronizationApp
                }));
            }

            const app = getSynchronizationApp(synchronizationApp);

            if (!app) {
                throw new Error('No synchronization application defined');
            }

            await dispatch(app.synchronize());
        } finally {
            await dispatch(setSynchronizing(false));
        }
    };
}

export function resetDataForSynchronization() {
    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        let { synchronizationApp } = settings;

        if (!synchronizationApp) {
            synchronizationApp = await selectSynchronizationApp();

            if (!synchronizationApp) {
                return;
            }

            await dispatch(updateSettings({
                synchronizationApp
            }));
        }

        const app = getSynchronizationApp(synchronizationApp);

        if (!app) {
            throw new Error('No synchronization application defined');
        }

        await dispatch(app.resetData());
    };
}