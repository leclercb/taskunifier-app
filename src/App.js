import React, { useEffect } from 'react';
import AppLayout from './components/applayout/AppLayout';
import withApp from './containers/WithApp';
import './App.css';

function App(props) {
    useEffect(() => props.loadData(), [true]);

    return (
        <AppLayout />
    );
}

export default withApp(App);