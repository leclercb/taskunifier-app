import React from 'react';
import './App.css';
import AppLayout from './components/applayout/AppLayout';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';

const store = createStore(
    rootReducer,
    applyMiddleware(thunk));

function App() {
    return (
        <Provider store={store}>
            <AppLayout />
        </Provider>
    );
}

export default App;