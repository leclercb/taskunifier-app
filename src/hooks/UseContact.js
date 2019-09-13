import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getVisibleContactSelector } from 'selectors/ContactSelectors';

export function useContact(contactId) {
    const getVisibleContact = useMemo(getVisibleContactSelector, []);
    const contact = useSelector(state => getVisibleContact(state, contactId));
    return contact;
}