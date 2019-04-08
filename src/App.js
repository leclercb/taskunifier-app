import React, { useEffect } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import AppLayout from './components/layout/AppLayout';
import withApp from './containers/WithApp';
import './App.css';

const DragDropContextHTML5 = DragDropContext(HTML5Backend);

function App(props) {
    useEffect(() => {
        props.loadData();
    }, [true]);

    return (
        <AppLayout />
    );
}

export default DragDropContextHTML5(withApp(App));