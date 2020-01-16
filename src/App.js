import React, { useEffect } from 'react';
import { Modal } from 'antd';
import moment from 'moment';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import AppLayout from 'components/layout/AppLayout';
import withJoyride from 'containers/WithJoyride';
import { useAppApi } from 'hooks/UseAppApi';
import { useInterval } from 'hooks/UseInterval';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { isAutomaticSaveNeeded } from 'utils/AppUtils';
import { isAutomaticBackupNeeded } from 'utils/BackupUtils';
import { isAutomaticSyncNeeded } from 'utils/SynchronizationUtils';
import { checkLatestVersion } from 'utils/VersionUtils';

import 'App.css';
import 'font-awesome.js';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-virtualized/styles.css';
import 'components/common/table/VirtualizedTable.css';

function App() {
    const appApi = useAppApi();
    const settingsApi = useSettingsApi();

    useInterval(() => {
        appApi.updateMinuteTimer();
    }, 60000);

    useEffect(() => {
        appApi.loadData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    }, [settingsApi.settings]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(
        () => {
            if (process.env.REACT_APP_MODE === 'electron') {
                const interval = setInterval(() => {
                    if (isAutomaticSaveNeeded(settingsApi.settings, appApi.startDate)) {
                        appApi.saveData();

                        settingsApi.updateSettings({
                            lastAutomaticSave: moment().toISOString()
                        });
                    }
                }, 30 * 1000);

                return () => {
                    clearInterval(interval);
                };
            }
        },
        [ // eslint-disable-line react-hooks/exhaustive-deps
            appApi.startDate,
            settingsApi.settings.automaticSave,
            settingsApi.settings.automaticSaveInterval,
            settingsApi.settings.lastAutomaticSave
        ]
    );

    useEffect(
        () => {
            if (process.env.REACT_APP_MODE === 'electron') {
                const interval = setInterval(() => {
                    if (isAutomaticBackupNeeded(settingsApi.settings)) {
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
        [ // eslint-disable-line react-hooks/exhaustive-deps
            settingsApi.settings.automaticBackup,
            settingsApi.settings.automaticBackupInterval,
            settingsApi.settings.lastAutomaticBackup
        ]
    );

    useEffect(
        () => {
            if (process.env.REACT_APP_MODE === 'electron') {
                const interval = setInterval(() => {
                    if (isAutomaticSyncNeeded(settingsApi.settings, appApi.isPro)) {
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
        [ // eslint-disable-line react-hooks/exhaustive-deps
            appApi.isPro,
            settingsApi.settings.automaticSynchronization,
            settingsApi.settings.automaticSynchronizationInterval,
            settingsApi.settings.lastAutomaticSynchronization
        ]
    );

    return (
        <DndProvider backend={HTML5Backend}>
            <AppLayout />
        </DndProvider>
    );
}

export default withJoyride(App);