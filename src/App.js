import React, { useEffect } from 'react';
import { DragDropContext } from 'react-dnd';
import { useInterval } from './hooks/UseInterval';
import HTML5Backend from 'react-dnd-html5-backend';
import AppLayout from './components/layout/AppLayout';
import withApp from './containers/WithApp';

import './font-awesome.js';
import './App.css';
import 'antd-table-infinity/index.css';
import 'rc-color-picker/assets/index.css';
import 'react-contexify/dist/ReactContexify.min.css';

const DragDropContextHTML5 = DragDropContext(HTML5Backend);

function App(props) {
    useEffect(() => {
        props.loadData();
    }, []);

    useInterval(() => {
        props.backupData();
    }, null);

    return (
        <AppLayout />
    );
}

export default DragDropContextHTML5(withApp(App));