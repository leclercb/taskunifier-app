import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountInfo, synchronize } from 'actions/SynchronizationActions';
import { getSynchronization } from 'selectors/SynchronizationSelectors';

export function useSynchronizationApi() {
    const dispatch = useDispatch();
    const synchronization = useSelector(getSynchronization);

    const synchronizeCallback = useCallback(
        () => dispatch(synchronize()),
        [dispatch]
    );

    const getAccountInfoCallback = useCallback(
        () => dispatch(getAccountInfo()),
        [dispatch]
    );

    return {
        synchronization,
        synchronize: synchronizeCallback,
        getAccountInfo: getAccountInfoCallback
    };
}