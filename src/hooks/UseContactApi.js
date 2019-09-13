import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addContact, deleteContact, duplicateContact, updateContact } from 'actions/ContactActions';
import { getContactsFilteredByVisibleState } from 'selectors/ContactSelectors';

export function useContactApi() {
    const dispatch = useDispatch();
    const contacts = useSelector(getContactsFilteredByVisibleState);

    const addContactCallback = useCallback(
        contact => dispatch(addContact(contact)),
        [dispatch]
    );

    const duplicateContactCallback = useCallback(
        contact => dispatch(duplicateContact(contact)),
        [dispatch]
    );

    const updateContactCallback = useCallback(
        contact => dispatch(updateContact(contact)),
        [dispatch]
    );

    const deleteContactCallback = useCallback(
        contactId => dispatch(deleteContact(contactId)),
        [dispatch]
    );

    return {
        contacts,
        addContact: addContactCallback,
        duplicateContact: duplicateContactCallback,
        updateContact: updateContactCallback,
        deleteContact: deleteContactCallback
    };
}