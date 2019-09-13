import {
    addObject,
    cleanObjects,
    deleteObject,
    duplicateObject,
    loadObjectsFromFile,
    loadObjectsFromServer,
    saveObjectsToFile,
    setObjects,
    updateObject
} from 'actions/ObjectActions';
import Constants from 'constants/Constants';

export function loadContactsFromFile(file) {
    return loadObjectsFromFile('contacts', file);
}

export function saveContactsToFile(file, data) {
    return saveObjectsToFile('contacts', file, data);
}

export function loadContactsFromServer() {
    return loadObjectsFromServer('contacts');
}

export function setContacts(contacts) {
    return setObjects('contacts', contacts);
}

export function addContact(contact, options = {}) {
    return addObject('contacts', contact, options, {
        firstName: 'Unnamed',
        lastName: 'Unnamed',
        color: Constants.defaultObjectColor
    });
}

export function duplicateContact(contact, options = {}) {
    return duplicateObject('contacts', contact, options);
}

export function updateContact(contact, options = {}) {
    return updateObject('contacts', contact, options);
}

export function deleteContact(contactId, options = {}) {
    return deleteObject('contacts', contactId, options);
}

export function cleanContacts() {
    return cleanObjects('contacts');
}