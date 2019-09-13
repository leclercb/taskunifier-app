import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getVisibleContextSelector } from 'selectors/ContextSelectors';

export function useContext(contextId) {
    const getVisibleContext = useMemo(getVisibleContextSelector, []);
    const context = useSelector(state => getVisibleContext(state, contextId));
    return context;
}