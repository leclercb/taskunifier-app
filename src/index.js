import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { notification } from 'antd';
import { configure } from 'Amplify';
import App from 'App';
import { initializeEvents } from './events';
import { initializeShortcuts } from './shortcuts';
import LoadingIndicator from 'components/common/LoadingIndicator';
import PrivateComponent from 'components/common/PrivateComponent';
import { store } from 'store/Store';
import logger from 'utils/LogUtils';
import 'index.css';

initializeEvents();
initializeShortcuts();

window.addEventListener('error', function (e) {
    if (e.message === 'ResizeObserver loop limit exceeded') {
        return false;
    }

    logger.error('Uncaught error', e);

    notification.error({
        message: 'An error occurred',
        description: e.error ? e.error.toString() : e.message
    });

    return false;
});

let element = (
    <React.Suspense fallback={(<LoadingIndicator />)}>
        <App />
    </React.Suspense>
);

if (process.env.REACT_APP_MODE === 'react') {
    configure();

    element = (
        <PrivateComponent>
            {element}
        </PrivateComponent>
    );
}

ReactDOM.render(
    <Provider store={store}>
        {element}
    </Provider>,
    document.getElementById('root'));