export function getContactTitle(contact) {
    if (!contact) {
        return '';
    }

    const firstName = contact.firstName ? contact.firstName : '';
    const lastName = contact.lastName ? contact.lastName : '';

    return `${firstName} ${lastName}`;
}