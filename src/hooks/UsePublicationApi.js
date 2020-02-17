import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountInfo, publish } from 'actions/PublicationActions';
import { getPublication } from 'selectors/PublicationSelectors';

export function usePublicationApi() {
    const dispatch = useDispatch();
    const publication = useSelector(getPublication);

    const publishCallback = useCallback(
        () => dispatch(publish()),
        [dispatch]
    );

    const getAccountInfoCallback = useCallback(
        appId => dispatch(getAccountInfo(appId)),
        [dispatch]
    );

    return {
        publication,
        publish: publishCallback,
        getAccountInfo: getAccountInfoCallback
    };
}