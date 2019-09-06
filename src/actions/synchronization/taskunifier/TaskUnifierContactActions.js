import moment from 'moment';
import { addContact, deleteContact, updateContact } from 'actions/ContactActions';
import { sendRequest } from 'actions/RequestActions';
import { getConfig } from 'config/Config';
import { getContacts } from 'selectors/ContactSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeContacts() {
    return async (dispatch, getState) => {
        let contacts = getContacts(getState());

        {
            const contactsToAdd = filterByVisibleState(contacts).filter(contact => !contact.refIds.taskunifier);
            const contactsToAddPromises = contactsToAdd.map(contact => dispatch(addRemoteContact(contact)));
            const result = await Promise.all(contactsToAddPromises);

            for (let contact of result) {
                await dispatch(updateContact(contact, { loaded: true }));
            }
        }

        contacts = getContacts(getState());

        {
            const contactsToDelete = contacts.filter(contact => !!contact.refIds.taskunifier && contact.state === 'TO_DELETE');
            const contactsToDeletePromises = contactsToDelete.map(contact => dispatch(deleteRemoteContact(contact)));
            await Promise.all(contactsToDeletePromises);

            for (let contact of contactsToDelete) {
                await dispatch(deleteContact(contact.id));
            }
        }

        contacts = getContacts(getState());

        const remoteContacts = await dispatch(getRemoteContacts());

        for (let remoteContact of remoteContacts) {
            const localContact = contacts.find(contact => contact.refIds.taskunifier === remoteContact.refIds.taskunifier);

            if (!localContact) {
                await dispatch(addContact(remoteContact, { keepRefIds: true }));
            } else {
                if (moment(remoteContact.updateDate).diff(moment(localContact.updateDate)) > 0) {
                    await dispatch(updateContact(merge(localContact, remoteContact), { loaded: true }));
                }
            }
        }

        contacts = getContacts(getState());

        // eslint-disable-next-line require-atomic-updates
        for (let localContact of filterByVisibleState(contacts)) {
            if (!remoteContacts.find(contact => contact.refIds.taskunifier === localContact.refIds.taskunifier)) {
                await dispatch(deleteContact(localContact.id, { force: true }));
            }
        }

        contacts = getContacts(getState());

        {
            const contactsToUpdate = contacts.filter(contact => !!contact.refIds.taskunifier && contact.state === 'TO_UPDATE');
            const contactsToUpdatePromises = contactsToUpdate.map(contact => dispatch(editRemoteContact(contact)));
            await Promise.all(contactsToUpdatePromises);

            for (let contact of contactsToUpdate) {
                await dispatch(updateContact(contact, { loaded: true }));
            }
        }
    };
}

export function getRemoteContacts(updatedAfter) {
    console.debug('getRemoteContacts');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'GET',
                url: `${getConfig().apiUrl}/v1/contacts`,
                query: {
                    updatedAfter: updatedAfter ? updatedAfter.toISOString() : null
                }
            },
            settings);

        return result.data.map(contact => convertContactToLocal(contact));
    };
}

export function addRemoteContact(contact) {
    console.debug('addRemoteContact', contact);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'POST',
                url: `${getConfig().apiUrl}/v1/contacts`,
                data: convertContactToRemote(contact)
            },
            settings);

        return {
            ...contact,
            refIds: {
                ...contact.refIds,
                taskunifier: result.data.id
            }
        };
    };
}

export function editRemoteContact(contact) {
    console.debug('editRemoteContact', contact);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'PUT',
                url: `${getConfig().apiUrl}/v1/contacts/${contact.refIds.taskunifier}`,
                data: convertContactToRemote(contact)
            },
            settings);
    };
}

export function deleteRemoteContact(contact) {
    console.debug('deleteRemoteContact', contact);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        try {
            await sendRequest(
                {
                    headers: {
                        Authorization: `Bearer ${settings.taskunifier.accessToken}`
                    },
                    method: 'DELETE',
                    url: `${getConfig().apiUrl}/v1/contacts/${contact.refIds.taskunifier}`
                },
                settings);
        } catch (error) {
            // No throw exception if delete fails
            console.debug(error);
        }
    };
}

function convertContactToRemote(contact) {
    const remoteContact = { ...contact };

    delete remoteContact.id;
    delete remoteContact.refIds;
    delete remoteContact.state;
    delete remoteContact.creationDate;
    delete remoteContact.updateDate;

    return remoteContact;
}

function convertContactToLocal(contact) {
    const localContact = {
        ...contact,
        refIds: {
            taskunifier: contact.id
        }
    };

    delete localContact.id;
    delete localContact.owner;

    return localContact;
}