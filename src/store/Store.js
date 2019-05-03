import { applyMiddleware, createStore } from 'redux';
import Reducers from 'reducers/Reducers';
import thunk from 'redux-thunk';

export const store = createStore(Reducers, applyMiddleware(thunk));