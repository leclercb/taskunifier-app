import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { check, login, logout } from 'actions/SessionActions';
import { getSession } from 'selectors/SessionSelectors';

export function useSessionApi() {
    const dispatch = useDispatch();
    const session = useSelector(getSession);

    const checkCallback = useCallback(
        () => dispatch(check()),
        [dispatch]
    );

    const loginCallback = useCallback(
        () => dispatch(login()),
        [dispatch]
    );

    const logoutCallback = useCallback(
        () => dispatch(logout()),
        [dispatch]
    );

    return {
        session,
        check: checkCallback,
        login: loginCallback,
        logout: logoutCallback
    };
}