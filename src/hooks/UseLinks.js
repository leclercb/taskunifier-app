import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getLinksSelector } from 'selectors/LinkSelectors';

export function useLinks(property) {
    const getLinks = useMemo(getLinksSelector, []);
    const links = useSelector(state => getLinks(state, property));

    return {
        links
    };
}