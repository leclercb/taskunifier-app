import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DragDropContext } from 'react-dnd';
import { useInterval } from 'hooks/UseInterval';
import HTML5Backend from 'react-dnd-html5-backend';
import AppLayout from 'components/layout/AppLayout';
import withApp from 'containers/WithApp';
import withSettings from 'containers/WithSettings';

import 'App.css';
import 'font-awesome.js';
import 'rc-color-picker/assets/index.css';
import 'react-contexify/dist/ReactContexify.min.css';
import 'react-virtualized/styles.css';

import 'components/common/table/VirtualizedTable.css';

const electron = window.require('electron');

function App(props) {
    const onClose = () => {
        const size = electron.remote.getCurrentWindow().getSize();
        const position = electron.remote.getCurrentWindow().getPosition();

        props.updateSettings({
            windowSizeWidth: size[0],
            windowSizeHeight: size[1],
            windowPositionX: position[0],
            windowPositionY: position[1]
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
        };
    }, []);

    useEffect(
        () => {
            let interval = null;

            const automaticSave = props.settings.automaticSave;
            const automaticSaveInterval = props.settings.automaticSaveInterval;

            if (automaticSave &&
                Number.isInteger(automaticSaveInterval) &&
                automaticSaveInterval > 0) {
                interval = setInterval(() => {
                    props.saveData();
                    props.updateSettings({
                        lastAutomaticSave: moment().toJSON()
                    });
                }, automaticSaveInterval * 60 * 1000);

            }

            return () => {
                clearInterval(interval);
            };
        },
        [
            props.settings.automaticSave,
            props.settings.automaticSaveInterval
        ]
    );

    useEffect(
        () => {
            let interval = null;

            interval = setInterval(() => {
                const automaticBackup = props.settings.automaticBackup;
                const automaticBackupInterval = props.settings.automaticBackupInterval;
                const lastAutomaticBackup = props.settings.lastAutomaticBackup;

                if (automaticBackup &&
                    Number.isInteger(automaticBackupInterval) &&
                    automaticBackupInterval > 0 &&
                    (!lastAutomaticBackup || moment().diff(moment(lastAutomaticBackup)) > automaticBackupInterval * 60 * 1000)) {
                    props.backupData();
                    props.updateSettings({
                        lastAutomaticBackup: moment().toJSON()
                    });
                }
            }, 30 * 1000);

            return () => {
                clearInterval(interval);
            };
        },
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
    settings: PropTypes.object.isRequired,
    updateSettings: PropTypes.func.isRequired,
    loadData: PropTypes.func.isRequired,
    saveData: PropTypes.func.isRequired,
    backupData: PropTypes.func.isRequired
};

export default DragDropContext(HTML5Backend)(withApp(withSettings(App)));