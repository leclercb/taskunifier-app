import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DragDropContext } from 'react-dnd';
import { useInterval } from './hooks/UseInterval';
import HTML5Backend from 'react-dnd-html5-backend';
import AppLayout from './components/layout/AppLayout';
import withApp from './containers/WithApp';
import withSettings from './containers/WithSettings';

import './App.css';
import './font-awesome.js';
import 'antd-table-infinity/index.css';
import 'rc-color-picker/assets/index.css';
import 'react-contexify/dist/ReactContexify.min.css';

const electron = window.require('electron');

function App(props) {
    const onClose = () => {
        const size = electron.remote.getCurrentWindow().getSize();
        const position = electron.remote.getCurrentWindow().getPosition();

        props.updateSettings({
            window_size_width: size[0],
            window_size_height: size[1],
            window_position_x: position[0],
            window_position_y: position[1]
        }).then(() => {
            props.saveData({ clean: true }).finally(() => {
                electron.ipcRenderer.send('closed');
            });
        });
    };

    useEffect(() => {
        props.loadData();
        electron.ipcRenderer.on('app-close', onClose);

        return () => {
            electron.ipcRenderer.removeListener('app-close', onClose);
        }
    }, []);

    useEffect(
        () => {
            let interval = null;

            const automaticSave = props.getSetting('automatic_save');
            const automaticSaveInterval = props.getSetting('automatic_save_interval');

            if (automaticSave &&
                Number.isInteger(automaticSaveInterval) &&
                automaticSaveInterval > 0) {
                interval = setInterval(() => {
                    props.saveData();
                    props.updateSettings({
                        last_automatic_save: moment().toJSON()
                    });
                }, automaticSaveInterval * 60 * 1000);

            }

            return () => {
                clearInterval(interval);
            }
        },
        [
            props.settings.loaded,
            props.getSetting('automatic_save'),
            props.getSetting('automatic_save_interval')
        ]
    );

    useEffect(
        () => {
            let interval = null;

            interval = setInterval(() => {
                const automaticBackup = props.getSetting('automatic_backup');
                const automaticBackupInterval = props.getSetting('automatic_backup_interval');
                const lastAutomaticBackup = props.getSetting('last_automatic_backup');

                if (automaticBackup &&
                    Number.isInteger(automaticBackupInterval) &&
                    automaticBackupInterval > 0 &&
                    (!lastAutomaticBackup || moment().diff(moment(lastAutomaticBackup)) > automaticBackupInterval * 60 * 1000)) {
                    props.backupData();
                    props.updateSettings({
                        last_automatic_backup: moment().toJSON()
                    });
                }
            }, 30 * 1000);

            return () => {
                clearInterval(interval);
            }
        },
        [
            props.settings.loaded,
            props.getSetting('automatic_backup'),
            props.getSetting('automatic_backup_interval'),
            props.getSetting('last_automatic_backup')
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
    getSetting: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    loadData: PropTypes.func.isRequired,
    saveData: PropTypes.func.isRequired,
    backupData: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired
}

export default DragDropContext(HTML5Backend)(withApp(withSettings(App)));