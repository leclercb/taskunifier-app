import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import { useInterval } from './hooks/UseInterval';
import HTML5Backend from 'react-dnd-html5-backend';
import AppLayout from './components/layout/AppLayout';
import withApp from './containers/WithApp';
import withSettings from './containers/WithSettings';

import './font-awesome.js';
import './App.css';
import 'antd-table-infinity/index.css';
import 'rc-color-picker/assets/index.css';
import 'react-contexify/dist/ReactContexify.min.css';

const electron = window.require('electron');

function App(props) {
    const onClose = () => {
        const resolution = electron.remote.getCurrentWindow().getSize();

        props.updateSettings({
            window_width: resolution[0],
            window_height: resolution[1]
        }).then(() => {
            props.saveData().then(() => {
                electron.ipcRenderer.send('closed');
            });
        });
    };

    useEffect(() => {
        props.loadData().then(state => {
            electron.ipcRenderer.send('resize', {
                width: state.settings.data.window_width,
                height: state.settings.data.window_height
            });
        });

        electron.ipcRenderer.on('app-close', onClose);

        return () => electron.ipcRenderer.removeListener('app-close', onClose);
    }, []);

    useInterval(() => {
        props.backupData();
    }, null);

    return (
        <AppLayout />
    );
}

App.propTypes = {
    settings: PropTypes.object.isRequired,
    loadData: PropTypes.func.isRequired,
    saveData: PropTypes.func.isRequired,
    backupData: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired
}

export default DragDropContext(HTML5Backend)(withApp(withSettings(App)));