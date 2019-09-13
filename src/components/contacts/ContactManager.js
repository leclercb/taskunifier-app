import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import ContactList from 'components/contacts/ContactList';
import ContactForm from 'components/contacts/ContactForm';
import { useContactApi } from 'hooks/UseContactApi';

function ContactManager(props) {
    const contactApi = useContactApi();
    const selectedContactId = props.contactId;

    const onAddContact = async contact => {
        contact = await contactApi.addContact(contact);
        props.onContactSelection(contact.id);
    };

    const onDuplicateContact = async contact => {
        contact = await contactApi.duplicateContact(contact);
        props.onContactSelection(contact.id);
    };

    const onContactSelection = contact => {
        props.onContactSelection(contact.id);
    };

    const selectedContact = contactApi.contacts.find(contact => contact.id === selectedContactId);

    return (
        <Row>
            <Col span={6}>
                <ContactList
                    contacts={contactApi.contacts}
                    selectedContactId={selectedContactId}
                    addContact={onAddContact}
                    duplicateContact={onDuplicateContact}
                    deleteContact={contactApi.deleteContact}
                    onContactSelection={onContactSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedContact ? (
                    <ContactForm key={selectedContactId} contact={selectedContact} updateContact={contactApi.updateContact} />
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