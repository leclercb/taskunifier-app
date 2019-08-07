import React, { useEffect } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DndProvider } from 'react-dnd';
import { useInterval } from 'hooks/UseInterval';
import HTML5Backend from 'react-dnd-html5-backend';
import AppLayout from 'components/layout/AppLayout';
import withApp from 'containers/WithApp';
import withJoyride from 'containers/WithJoyride';
import withSettings from 'containers/WithSettings';

import 'App.css';
import 'font-awesome.js';
import 'rc-color-picker/assets/index.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-contexify/dist/ReactContexify.min.css';
import 'react-virtualized/styles.css';
import 'components/common/table/VirtualizedTable.css';

function App(props) {
    useEffect(() => {
        props.loadData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (process.env.REACT_APP_MODE === 'electron') {
            const { ipcRenderer } = window.require('electron');

            const onClose = () => {
                const size = ipcRenderer.sendSync('get-current-window-size');
                const position = ipcRenderer.sendSync('get-current-window-position');

                props.updateSettings({
                    windowSizeWidth: size[0],
                    windowSizeHeight: size[1],
                    windowPositionX: position[0],
                    windowPositionY: position[1]
                }).then(() => {
                    const close = () => {
                        props.saveData({ clean: true }).finally(() => {
                            ipcRenderer.send('closed');
                        });
                    };

                    if (props.settings.confirmBeforeClosing) {
                        Modal.confirm({
                            title: 'Do you want to close TaskUnifier ?',
                            onOk: () => {
                                close();
                            }
                        });
                    } else {
                        close();
                    }
                });
            };

            ipcRenderer.on('app-close', onClose);

            return () => {
                ipcRenderer.removeListener('app-close', onClose);
            };
        }
    }, [props.settings]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(
        () => {
            if (process.env.REACT_APP_MODE === 'electron') {
                let interval = null;

                const { automaticSave, automaticSaveInterval } = props.settings;

                if (automaticSave &&
                    Number.isInteger(automaticSaveInterval) &&
                    automaticSaveInterval > 0) {
                    interval = setInterval(() => {
                        props.saveData();
                        props.updateSettings({
                            lastAutomaticSave: moment().toISOString()
                        });
                    }, automaticSaveInterval * 60 * 1000);

                }

                return () => {
                    clearInterval(interval);
                };
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            props.settings.automaticSave,
            props.settings.automaticSaveInterval
        ]
    );

    useEffect(
        () => {
            if (process.env.REACT_APP_MODE === 'electron') {
                let interval = null;

                interval = setInterval(() => {
                    const { automaticBackup, automaticBackupInterval, lastAutomaticBackup } = props.settings;

                    if (automaticBackup &&
                        Number.isInteger(automaticBackupInterval) &&
                        automaticBackupInterval > 0 &&
                        (!lastAutomaticBackup || moment().diff(moment(lastAutomaticBackup)) > automaticBackupInterval * 60 * 1000)) {
                        props.backupData();
                        props.updateSettings({
                            lastAutomaticBackup: moment().toISOString()
                        });
                    }
                }, 30 * 1000);

                return () => {
                    clearInterval(interval);
                };
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            props.settings.automaticBackup,
            props.settings.automaticBackupInterval,
            props.settings.lastAutomaticBackup
        ]
    );

    useEffect(
        () => {
            if (process.env.REACT_APP_MODE === 'electron') {
                let interval = null;

                interval = setInterval(() => {
                    const { automaticSynchronization, automaticSynchronizationInterval, lastAutomaticSynchronization } = props.settings;

                    if (automaticSynchronization &&
                        Number.isInteger(automaticSynchronizationInterval) &&
                        automaticSynchronizationInterval > 0 &&
                        (!lastAutomaticSynchronization || moment().diff(moment(lastAutomaticSynchronization)) > automaticSynchronizationInterval * 60 * 1000)) {
                        props.synchronize();
                        props.updateSettings({
                            lastAutomaticSynchronization: moment().toISOString()
                        });
                    }
                }, 30 * 1000);

                return () => {
                    clearInterval(interval);
                };
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            props.settings.automaticSynchronization,
            props.settings.automaticSynchronizationInterval,
            props.settings.lastAutomaticSynchronization
        ]
    );

    useInterval(() => {
        if (process.env.REACT_APP_MODE === 'electron') {
            props.backupData();
            props.synchronize();
        }
    }, null);

    return (
        <DndProvider backend={HTML5Backend}>
            <AppLayout />
        </DndProvider>
    );
}

App.propTypes = {
    settings: PropTypes.shape({
        confirmBeforeClosing: PropTypes.bool.isRequired,
        automaticSave: PropTypes.bool.isRequired,
        automaticSaveInterval: PropTypes.number.isRequired,
        automaticBackup: PropTypes.bool.isRequired,
        automaticBackupInterval: PropTypes.number.isRequired,
        lastAutomaticBackup: PropTypes.string.isRequired,
        automaticSynchronization: PropTypes.bool.isRequired,
        automaticSynchronizationInterval: PropTypes.number.isRequired,
        lastAutomaticSynchronization: PropTypes.string.isRequired
    }).isRequired,
    updateSettings: PropTypes.func.isRequired,
    loadData: PropTypes.func.isRequired,
    saveData: PropTypes.func.isRequired,
    backupData: PropTypes.func.isRequired,
    synchronize: PropTypes.func.isRequired
};

export default withApp(withSettings(withJoyride(App)));