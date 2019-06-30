import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { notification } from 'antd';
import App from 'App';
import { initializeApi } from 'api/Api';
import { store } from 'store/Store';
import 'index.css';

initializeApi();

window.addEventListener('error', function (e) {
    notification.error({
        message: 'An error occurred',
        description: e.error.message
    });

    return false;
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));