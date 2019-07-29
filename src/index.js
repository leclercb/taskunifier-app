import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { notification } from 'antd';
import App from 'App';
import PrivateComponent from 'components/common/PrivateComponent';
import { store } from 'store/Store';
import 'Amplify';
import 'index.css';

window.addEventListener('error', function (e) {
    notification.error({
        message: 'An error occurred',
        description: e.error.message
    });

    return false;
});

let element = (
    <App />
);

if (process.env.REACT_APP_MODE !== 'electron') {
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