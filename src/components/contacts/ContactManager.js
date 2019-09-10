import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import withContacts from 'containers/WithContacts';
import ContactList from 'components/contacts/ContactList';
import ContactForm from 'components/contacts/ContactForm';
import { ContactPropType } from 'proptypes/ContactPropTypes';

function ContactManager(props) {
    const selectedContactId = props.contactId;

    const onAddContact = async contact => {
        contact = await props.addContact(contact);
        props.onContactSelection(contact.id);
    };

    const onDuplicateContact = async contact => {
        contact = await props.duplicateContact(contact);
        props.onContactSelection(contact.id);
    };

    const onContactSelection = contact => {
        props.onContactSelection(contact.id);
    };

    const selectedContact = props.contacts.find(contact => contact.id === selectedContactId);

    return (
        <Row>
            <Col span={6}>
                <ContactList
                    contacts={props.contacts}
                    selectedContactId={selectedContactId}
                    addContact={onAddContact}
                    duplicateContact={onDuplicateContact}
                    deleteContact={props.deleteContact}
                    onContactSelection={onContactSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedContact ? (
                    <ContactForm key={selectedContactId} contact={selectedContact} updateContact={props.updateContact} />
                ) : <Empty description="Please select a contact" />}
            </Col>
        </Row>
    );
}

ContactManager.propTypes = {
    contactId: PropTypes.string,
    contacts: PropTypes.arrayOf(ContactPropType.isRequired).isRequired,
    onContactSelection: PropTypes.func.isRequired,
    addContact: PropTypes.func.isRequired,
    duplicateContact: PropTypes.func.isRequired,
    updateContact: PropTypes.func.isRequired,
    deleteContact: PropTypes.func.isRequired
};

export default withContacts(ContactManager);