import React, { useEffect } from 'react';
import { Modal } from 'antd';
import moment from 'moment';
import { DndProvider } from 'react-dnd';
import { useInterval } from 'hooks/UseInterval';
import HTML5Backend from 'react-dnd-html5-backend';
import AppLayout from 'components/layout/AppLayout';
import withJoyride from 'containers/WithJoyride';
import { useAppApi } from 'hooks/UseAppApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { checkLatestVersion } from 'utils/VersionUtils';

import 'App.css';
import 'font-awesome.js';
import 'rc-color-picker/assets/index.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-virtualized/styles.css';
import 'components/common/table/VirtualizedTable.css';

function App() {
    const appApi = useAppApi();
    const settingsApi = useSettingsApi();

    useEffect(() => {
        appApi.loadData();
    }, []);

    useEffect(() => {
        if (process.env.REACT_APP_MODE === 'electron') {
            const timeout = setTimeout(async () => {
                const result = await checkLatestVersion(settingsApi.settings, true);

                if (result) {
                    settingsApi.updateSettings({
                        checkLatestVersion: result
                    });
                }
            }, 5000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, []);

    useEffect(() => {
        if (process.env.REACT_APP_MODE === 'electron') {
            const { ipcRenderer } = window.require('electron');

            const onClose = () => {
                const size = ipcRenderer.sendSync('get-current-window-size');
                const position = ipcRenderer.sendSync('get-current-window-position');

                settingsApi.updateSettings({
                    windowSizeWidth: size[0],
                    windowSizeHeight: size[1],
                    windowPositionX: position[0],
                    windowPositionY: position[1]
                }).then(() => {
                    const close = () => {
                        appApi.saveData({ clean: true }).finally(() => {
                            ipcRenderer.send('closed');
                        });
                    };

                    if (settingsApi.settings.confirmBeforeClosing) {
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
    }, [settingsApi.settings]);

    useEffect(
        () => {
            if (process.env.REACT_APP_MODE === 'electron') {
                let interval = null;

                const { automaticSave, automaticSaveInterval } = settingsApi.settings;

                if (automaticSave &&
                    Number.isInteger(automaticSaveInterval) &&
                    automaticSaveInterval > 0) {
                    interval = setInterval(() => {
                        appApi.saveData();
                        settingsApi.updateSettings({
                            lastAutomaticSave: moment().toISOString()
                        });
                    }, automaticSaveInterval * 60 * 1000);

                }

                return () => {
                    clearInterval(interval);
                };
            }
        },
        [
            settingsApi.settings.automaticSave,
            settingsApi.settings.automaticSaveInterval
        ]
    );

    useEffect(
        () => {
            if (process.env.REACT_APP_MODE === 'electron') {
                let interval = null;

                interval = setInterval(() => {
                    const { automaticBackup, automaticBackupInterval, lastAutomaticBackup } = settingsApi.settings;

                    if (automaticBackup &&
                        Number.isInteger(automaticBackupInterval) &&
                        automaticBackupInterval > 0 &&
                        (!lastAutomaticBackup || moment().diff(moment(lastAutomaticBackup)) > automaticBackupInterval * 60 * 1000)) {
                        appApi.backupData();
                        settingsApi.updateSettings({
                            lastAutomaticBackup: moment().toISOString()
                        });
                    }
                }, 30 * 1000);

                return () => {
                    clearInterval(interval);
                };
            }
        },
        [
            settingsApi.settings.automaticBackup,
            settingsApi.settings.automaticBackupInterval,
            settingsApi.settings.lastAutomaticBackup
        ]
    );

    useEffect(
        () => {
            if (process.env.REACT_APP_MODE === 'electron') {
                let interval = null;

                interval = setInterval(() => {
                    const { automaticSynchronization, automaticSynchronizationInterval, lastAutomaticSynchronization } = settingsApi.settings;

                    if (automaticSynchronization &&
                        Number.isInteger(automaticSynchronizationInterval) &&
                        automaticSynchronizationInterval > 0 &&
                        (!lastAutomaticSynchronization || moment().diff(moment(lastAutomaticSynchronization)) > automaticSynchronizationInterval * 60 * 1000)) {
                        appApi.synchronize();
                        settingsApi.updateSettings({
                            lastAutomaticSynchronization: moment().toISOString()
                        });
                    }
                }, 30 * 1000);

                return () => {
                    clearInterval(interval);
                };
            }
        },
        [
            settingsApi.settings.automaticSynchronization,
            settingsApi.settings.automaticSynchronizationInterval,
            settingsApi.settings.lastAutomaticSynchronization
        ]
    );

    useInterval(() => {
        if (process.env.REACT_APP_MODE === 'electron') {
            appApi.backupData();
            appApi.synchronize();
        }
    }, null);

    return (
        <DndProvider backend={HTML5Backend}>
            <AppLayout />
        </DndProvider>
    );
}

export default withJoyride(App);