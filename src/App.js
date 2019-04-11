import React, { useEffect } from 'react';
import { DragDropContext } from 'react-dnd';
import { useInterval } from './hooks/UseInterval';
import HTML5Backend from 'react-dnd-html5-backend';
import AppLayout from './components/layout/AppLayout';
import withApp from './containers/WithApp';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faArchive,
    faBomb,
    faBullseye,
    faCalendarAlt,
    faCheck,
    faCheckDouble,
    faChevronCircleRight,
    faCircle,
    faCompass,
    faCog,
    faCogs,
    faCubes,
    faEdit,
    faExclamationCircle,
    faExclamationTriangle,
    faFilter,
    faFolder,
    faFolderOpen,
    faHome,
    faPepperHot,
    faPlus,
    faSave,
    faSpinner,
    faStar,
    faTag,
    faThumbtack,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';

import './App.css';
import 'antd-table-infinity/index.css';
import 'rc-color-picker/assets/index.css';
import 'react-contexify/dist/ReactContexify.min.css';

library.add(faArchive);
library.add(faBomb);
library.add(faBullseye);
library.add(faCalendarAlt);
library.add(faCheck);
library.add(faCheckDouble);
library.add(faChevronCircleRight);
library.add(faCircle);
library.add(faCompass);
library.add(faCog);
library.add(faCogs);
library.add(faCubes);
library.add(faEdit);
library.add(faExclamationCircle);
library.add(faExclamationTriangle);
library.add(faFilter);
library.add(faFolder);
library.add(faFolderOpen);
library.add(faHome);
library.add(faPepperHot);
library.add(faPlus);
library.add(faSave);
library.add(faSpinner);
library.add(faStar);
library.add(faTag);
library.add(faThumbtack);
library.add(faTrashAlt);

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