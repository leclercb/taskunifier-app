import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    updateObject 
} from 'actions/ObjectActions';

export function loadContactsFromFile(file) {
    return loadObjectsFromFile('contacts', file);
};

export function saveContactsToFile(file, data) {
    return saveObjectsToFile('contacts', file, data);
};

export function setContacts(contacts) {
    return setObjects('contacts', contacts);
};

export function addContact(contact) {
    return addObject('contacts', contact);
};

export function updateContact(contact) {
    return updateObject('contacts', contact);
};

export function deleteContact(contactId) {
    return deleteObject('contacts', contactId);
};

export function cleanContacts() {
    return cleanObjects('contacts');
};