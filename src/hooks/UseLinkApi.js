import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getLinksSelector } from 'selectors/LinkSelectors';

export function useLinkApi(property) {
    const getLinks = useMemo(getLinksSelector, []);
    const links = useSelector(state => getLinks(state, property));

    return {
        links
    };
}