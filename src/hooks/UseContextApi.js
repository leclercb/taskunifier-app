import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addContext, deleteContext, duplicateContext, updateContext } from 'actions/ContextActions';
import { getContextsFilteredByVisibleState } from 'selectors/ContextSelectors';

export function useContextApi() {
    const dispatch = useDispatch();
    const contexts = useSelector(getContextsFilteredByVisibleState);

    const addContextCallback = useCallback(
        context => dispatch(addContext(context)),
        [dispatch]
    );

    const duplicateContextCallback = useCallback(
        context => dispatch(duplicateContext(context)),
        [dispatch]
    );

    const updateContextCallback = useCallback(
        context => dispatch(updateContext(context)),
        [dispatch]
    );

    const deleteContextCallback = useCallback(
        contextId => dispatch(deleteContext(contextId)),
        [dispatch]
    );

    return {
        contexts,
        addContext: addContextCallback,
        duplicateContext: duplicateContextCallback,
        updateContext: updateContextCallback,
        deleteContext: deleteContextCallback
    };
}