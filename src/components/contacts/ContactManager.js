import React, { useCallback } from 'react';
import { Col, Empty, Row } from 'antd';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { addContact, duplicateContact, updateContact, deleteContact } from 'actions/ContactActions';
import ContactList from 'components/contacts/ContactList';
import ContactForm from 'components/contacts/ContactForm';
import { getContactsFilteredByVisibleState } from 'selectors/ContactSelectors';

function ContactManager(props) {
    const dispatch = useDispatch();
    const contacts = useSelector(getContactsFilteredByVisibleState);
    const selectedContactId = props.contactId;

    const onAddContact = useCallback(async contact => {
        contact = await dispatch(addContact(contact));
        props.onContactSelection(contact.id);
    }, [dispatch]);

    const onUpdateContact = useCallback(contact => {
        dispatch(updateContact(contact));
    }, [dispatch]);

    const onDeleteContact = useCallback(contactId => {
        dispatch(deleteContact(contactId));
    }, [dispatch]);

    const onDuplicateContact = useCallback(async contact => {
        contact = await dispatch(duplicateContact(contact));
        props.onContactSelection(contact.id);
    }, [dispatch]);

    const onContactSelection = useCallback(contact => {
        props.onContactSelection(contact.id);
    }, [dispatch]);

    const selectedContact = contacts.find(contact => contact.id === selectedContactId);

    return (
        <Row>
            <Col span={6}>
                <ContactList
                    contacts={contacts}
                    selectedContactId={selectedContactId}
                    addContact={onAddContact}
                    duplicateContact={onDuplicateContact}
                    deleteContact={onDeleteContact}
                    onContactSelection={onContactSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedContact ? (
                    <ContactForm key={selectedContactId} contact={selectedContact} updateContact={onUpdateContact} />
                ) : <Empty description="Please select a contact" />}
            </Col>
        </Row>
    );
}

ContactManager.propTypes = {
    contactId: PropTypes.string,
    onContactSelection: PropTypes.func.isRequired
};

export default ContactManager;