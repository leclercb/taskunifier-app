import React, { useEffect } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DragDropContext } from 'react-dnd';
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

const { ipcRenderer } = window.require('electron');

function App(props) {
    useEffect(() => {
        props.loadData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
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
    }, [props.settings]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(
        () => {
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
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            props.settings.automaticSave,
            props.settings.automaticSaveInterval
        ]
    );

    useEffect(
        () => {
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
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            props.settings.automaticBackup,
            props.settings.automaticBackupInterval,
            props.settings.lastAutomaticBackup
        ]
    );

    useInterval(() => {
        props.backupData();
    }, null);

    return (
        <AppLayout />
    );
}

App.propTypes = {
    settings: PropTypes.shape({
        confirmBeforeClosing: PropTypes.bool.isRequired,
        automaticSave: PropTypes.bool.isRequired,
        automaticSaveInterval: PropTypes.number.isRequired,
        automaticBackup: PropTypes.bool.isRequired,
        automaticBackupInterval: PropTypes.number.isRequired,
        lastAutomaticBackup: PropTypes.string.isRequired
    }).isRequired,
    updateSettings: PropTypes.func.isRequired,
    loadData: PropTypes.func.isRequired,
    saveData: PropTypes.func.isRequired,
    backupData: PropTypes.func.isRequired
};

export default DragDropContext(HTML5Backend)(withApp(withSettings(withJoyride(App))));