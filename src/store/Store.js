import { applyMiddleware, compose, createStore } from 'redux';
import Reducers from 'reducers/Reducers';
import thunk from 'redux-thunk';

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    Reducers, 
    composeEnhancers(applyMiddleware(thunk)));