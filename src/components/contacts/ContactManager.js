import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Empty } from 'antd';
import withContacts from '../../containers/WithContacts';
import ContactList from './ContactList';
import ContactForm from './ContactForm';

function ContactManager(props) {
    const selectedContactId = props.contactId;

    const onAddContact = contact => {
        props.addContact(contact).then(id => props.onContactSelection(id));
    }

    const onContactSelection = contact => {
        props.onContactSelection(contact.id);
    }

    const selectedContact = props.contacts.find(contact => contact.id === selectedContactId);

    return (
        <Row>
            <Col span={6}>
                <ContactList
                    contacts={props.contacts}
                    selectedContactId={selectedContactId}
                    addContact={onAddContact}
                    deleteContact={props.deleteContact}
                    onContactSelection={onContactSelection} />
            </Col>
            <Col span={2}>

            </Col>
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
    onContactSelection: PropTypes.func.isRequired
};

export default withContacts(ContactManager);