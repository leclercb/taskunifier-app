import React from 'react';
import { connect } from 'react-redux';
import { addContact, updateContact, deleteContact } from '../actions/ContactActions';
import { filterObjects } from '../utils/CategoryUtils';

function withContacts(Component, options = { actionsOnly: false }) {
    function WithContacts(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => {
        if (options && options.actionsOnly === true) {
            return {};
        }

        return {
            contacts: filterObjects(state.contacts)
        };
    };

    const mapDispatchToProps = dispatch => ({
        addContact: contact => dispatch(addContact(contact)),
        updateContact: contact => dispatch(updateContact(contact)),
        deleteContact: contactId => dispatch(deleteContact(contactId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithContacts);
}

export default withContacts;