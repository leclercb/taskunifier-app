import { connect } from 'react-redux';
import { addContact, deleteContact, updateContact } from 'actions/ContactActions';
import withBusyCheck from 'containers/WithBusyCheck';

function withContacts(Component, options = { actionsOnly: false }) {
    const mapStateToProps = state => {
        if (options && options.actionsOnly === true) {
            return {};
        }

        return {
            contacts: state.contacts.filteredByVisibleState
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
    )(withBusyCheck(Component));
}

export default withContacts;