import { createSelector } from 'reselect';
import { filterByVisibleState } from 'utils/CategoryUtils';

export const getContacts = state => state.contacts;

export const getContactsFilteredByVisibleState = createSelector(
    getContacts,
    (contacts) => {
        return filterByVisibleState(contacts);
    }
);