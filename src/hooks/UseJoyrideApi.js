import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setJoyrideOptions } from 'actions/AppActions';
import { getJoyrideOptions } from 'selectors/AppSelectors';

export function useJoyrideApi() {
    const dispatch = useDispatch();
    const joyride = useSelector(getJoyrideOptions);

    const setJoyrideOptionsCallback = useCallback(
        options => dispatch(setJoyrideOptions(options)),
        [dispatch]
    );

    return {
        joyride,
        setJoyrideOptions: setJoyrideOptionsCallback
    };
}