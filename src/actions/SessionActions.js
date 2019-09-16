import React from 'react';
import { Modal } from 'antd';
import { Auth } from 'aws-amplify';
import { sendRequest } from 'actions/RequestActions';
import { getConfig } from 'config/Config';
import { getSession } from 'selectors/SessionSelectors';
import { getErrorMessages } from 'utils/CloudUtils';

async function getCurrentUser(token) {
    const result = await sendRequest(
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: 'GET',
            url: `${getConfig().apiUrl}/v1/users/current`,
            responseType: 'json'
        });

    return result.data;
}

export function check() {
    return login(true);
}

export function login(checkOnly = false) {
    return async (dispatch, getState) => {
        try {
            const state = getState();

            if (getSession(state).loading) {
                return;
            }

            let session;

            try {
                session = await Auth.currentSession();
            } catch (e) {
                session = null;
            }

            const isAuthenticated = !!session;

            if (!checkOnly && !isAuthenticated) {
                window.location.href = getConfig().authUrl + '?returnTo=' + encodeURIComponent(window.location.href);
            }

            if (isAuthenticated) {
                const user = await getCurrentUser(session.getAccessToken().getJwtToken());
                user.groups = session.getAccessToken().payload['cognito:groups'];

                await dispatch({
                    type: 'SET_USER',
                    user
                });
            }

            await dispatch({
                type: 'SET_AUTHENTICATED',
                authenticated: isAuthenticated
            });

            await dispatch({
                type: 'SET_LOADING',
                loading: false
            });
        } catch (error) {
            Modal.error({
                content: getErrorMessages(error, true).map(error => (<div key={error}>{error}</div>)),
                onOk: () => window.location.href = getConfig().cloudUrl
            });

            throw error;
        }
    };
}

export function logout() {
    return async dispatch => {
        await Auth.signOut();

        await dispatch({
            type: 'SET_AUTHENTICATED',
            authenticated: false
        });

        await dispatch({
            type: 'SET_USER',
            user: null
        });
    };
}