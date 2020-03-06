import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import { ActionCreators } from 'redux-undo';
import { updateSettings } from 'actions/SettingActions';
import ProLockedMessage from 'components/pro/ProLockedMessage';
import Constants from 'constants/Constants';
import { isPro } from 'selectors/AppSelectors';
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
                <SelectSynchronizationApp
                    synchronizationApp={synchronizationApp}
                    onChange={app => synchronizationApp = app} />
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

            if (!isPro(state)) {
                Modal.info({
                    icon: null,
                    width: 800,
                    content: (<ProLockedMessage />)
                });

                return;
            }

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
                message.warning('No synchronization application defined');
                return;
            }

            await dispatch(app.synchronize());

            await dispatch(updateSettings({
                lastSynchronizationDate: moment().toISOString()
            }));
        } finally {
            await dispatch(ActionCreators.clearHistory());
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

function SelectSynchronizationApp({ synchronizationApp, onChange }) {
    const [selectedSynchronizationApp, setSelectedSynchronizationApp] = useState(synchronizationApp);

    return (
        <React.Fragment>
            {getSynchronizationApps().map(app => (
                <Button
                    key={app.id}
                    onClick={() => {
                        setSelectedSynchronizationApp(app.id);
                        onChange(app.id);
                    }}
                    style={{
                        width: 200,
                        height: 200,
                        margin: '0px 10px',
                        backgroundColor: selectedSynchronizationApp === app.id ? Constants.lightIconColor : null
                    }}>
                    <img
                        alt={app.label}
                        src={app.img}
                        style={{ width: 100, height: 100, marginBottom: 25 }} />
                    <br />
                    {app.label}
                </Button>
            ))}
        </React.Fragment>
    );
}

SelectSynchronizationApp.propTypes = {
    synchronizationApp: PropTypes.string,
    onChange: PropTypes.func.isRequired
};