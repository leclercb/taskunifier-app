import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { pushToServer } from 'middlewares/cloud/PushToServer';
import { taskTextLoader } from 'middlewares/cloud/TaskTextLoader';
import Reducers from 'reducers/Reducers';

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [thunk];

if (process.env.REACT_APP_MODE === 'electron') {
    // No middleware
} else {
    middlewares.push(pushToServer);
    middlewares.push(taskTextLoader);
}

export const store = createStore(
    Reducers,
    composeEnhancers(applyMiddleware(
        thunk,
        ...middlewares
    )));