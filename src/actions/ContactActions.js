import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    loadObjectsFromFile,
    loadObjectsFromServer,
    saveObjectsToFile,
    setObjects, 
    updateObject 
} from 'actions/ObjectActions';

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
    return addObject('contacts', contact, options);
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