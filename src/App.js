import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AutoUpdater from 'components/autoupdater/AutoUpdater';
import AppLayout from 'components/layout/AppLayout';
import withJoyride from 'containers/WithJoyride';
import { useAppApi } from 'hooks/UseAppApi';
import { useAutoUpdaterApi } from 'hooks/UseAutoUpdaterApi';
import { useInterval } from 'hooks/UseInterval';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTaskReminderApi } from 'hooks/UseTaskReminderApi';
import { isAutomaticSaveNeeded } from 'utils/AppUtils';
import { isAutomaticBackupNeeded } from 'utils/BackupUtils';
import { closeCurrentWindow, getCurrentWindowPosition, getCurrentWindowSize, setBadgeCount } from 'utils/ElectronIpc';
import { isAutomaticPubNeeded } from 'utils/PublicationUtils';
import { isAutomaticSyncNeeded } from 'utils/SynchronizationUtils';
import { startNoteFilterCounterWorker, startTaskFilterCounterWorker } from 'utils/WorkerUtils';

import 'App.css';
import 'font-awesome.js';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-virtualized/styles.css';
import 'components/common/table/VirtualizedTable.css';

function App() {
    const appApi = useAppApi();
    const autoUpdaterApi = useAutoUpdaterApi();
    const settingsApi = useSettingsApi();
    const taskReminderApi = useTaskReminderApi();

    const [started, setStarted] = useState(false);

    useInterval(() => {
        appApi.updateMinuteTimer();
    }, 60000);

    useEffect(() => {
        const onStart = async () => {
            await appApi.loadData();
            setStarted(true);
        };

        onStart();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const onStarted = async () => {
            if (process.env.REACT_APP_MODE === 'electron') {
                if (settingsApi.settings.synchronizeAfterStarting) {
                    await appApi.synchronize();
                }

                if (settingsApi.settings.publishAfterStarting) {
                    await appApi.publish();
                }

                autoUpdaterApi.checkForUpdates(true);
            }
        };

        if (started) {
            onStarted();
        }
    }, [started]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (process.env.REACT_APP_MODE === 'electron') {
            const onClose = () => {
                const close = async () => {
                    const size = await getCurrentWindowSize();
                    const position = await getCurrentWindowPosition();

                    await settingsApi.updateSettings({
                        windowSizeWidth: size[0],
                        windowSizeHeight: size[1],
                        windowPositionX: position[0],
                        windowPositionY: position[1]
                    });

                    if (settingsApi.settings.synchronizeBeforeClosing) {
                        await appApi.synchronize();
                    }

                    if (settingsApi.settings.publishBeforeClosing) {
                        await appApi.publish();
                    }

                    await appApi.saveData({ clean: true });

                    await closeCurrentWindow();
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
            };

            const { ipcRenderer } = window.electron;

            ipcRenderer.removeAllListeners('window-close');
            ipcRenderer.on('window-close', onClose);
        }
    }, [ // eslint-disable-line react-hooks/exhaustive-deps
        settingsApi.settings.confirmBeforeClosing,
        settingsApi.settings.synchronizeBeforeClosing,
        settingsApi.settings.publishBeforeClosing
    ]);

    useEffect(
        () => {
            if (process.env.REACT_APP_MODE === 'electron') {
                const interval = setInterval(async () => {
                    if (isAutomaticSaveNeeded(settingsApi.settings, appApi.startDate)) {
                        try {
                            await appApi.checkIsBusy(() => appApi.saveData());
                        } catch (error) {
                            // Skip
                        }
                    }

                    if (isAutomaticBackupNeeded(settingsApi.settings)) {
                        try {
                            await appApi.checkIsBusy(() => appApi.backupData());
                        } catch (error) {
                            // Skip
                        }
                    }

                    if (isAutomaticSyncNeeded(settingsApi.settings, appApi.isPro)) {
                        try {
                            await appApi.checkIsBusy(() => appApi.synchronize());
                        } catch (error) {
                            // Skip
                        }
                    }

                    if (isAutomaticPubNeeded(settingsApi.settings, appApi.isPro)) {
                        try {
                            await appApi.checkIsBusy(() => appApi.publish());
                        } catch (error) {
                            // Skip
                        }
                    }
                }, 30 * 1000);

                return () => {
                    clearInterval(interval);
                };
            }
        },
        [ // eslint-disable-line react-hooks/exhaustive-deps
            appApi.isPro,
            appApi.startDate,
            settingsApi.settings.automaticSave,
            settingsApi.settings.automaticSaveInterval,
            settingsApi.settings.lastSaveDate,
            settingsApi.settings.automaticBackup,
            settingsApi.settings.automaticBackupInterval,
            settingsApi.settings.lastBackupDate,
            settingsApi.settings.automaticSynchronization,
            settingsApi.settings.automaticSynchronizationInterval,
            settingsApi.settings.lastSynchronizationDate,
            settingsApi.settings.automaticPublication,
            settingsApi.settings.automaticPublicationInterval,
            settingsApi.settings.lastPublicationDate
        ]
    );

    useEffect(() => {
        if (settingsApi.settings.showAllBadgeCounts) {
            const terminateNoteFilterCounterWorker = startNoteFilterCounterWorker(10000, data => {
                appApi.setNoteFilterCounts(data);
            });

            const terminateTaskFilterCounterWorker = startTaskFilterCounterWorker(10000, data => {
                appApi.setTaskFilterCounts(data);
            });

            return () => {
                terminateNoteFilterCounterWorker();
                terminateTaskFilterCounterWorker();
            };
        }
    }, [settingsApi.settings.showAllBadgeCounts]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (process.env.REACT_APP_MODE === 'electron') {
            setBadgeCount(taskReminderApi.tasks.length);
        }
    }, [taskReminderApi.tasks.length]);

    return (
        <DndProvider backend={HTML5Backend}>
            <AutoUpdater />
            <AppLayout />
        </DndProvider>
    );
}

export default withJoyride(App);