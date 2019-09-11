import { createSelector } from 'reselect';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { compareStrings } from 'utils/CompareUtils';
import { getContactTitle } from 'utils/ContactUtils';

export const getContacts = state => state.contacts;

export const getContactsFilteredByVisibleState = createSelector(
    getContacts,
    (contacts) => {
        return filterByVisibleState(contacts).sort((a, b) => compareStrings(getContactTitle(a), getContactTitle(b)));
    }
);

export const getVisibleContactSelector = () => createSelector(
    getContactsFilteredByVisibleState,
    (state, id) => id,
    (contacts, id) => {
        return contacts.find(contact => contact.id === id);
    }
);