import { connect } from 'react-redux';
import { addContact, updateContact, deleteContact } from '../actions/ContactActions';
import { filterObjects } from '../utils/CategoryUtils';
import withBusyCheck from '../components/common/WithBusyCheck';

function withContacts(Component, options = { actionsOnly: false }) {
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
    )(withBusyCheck(Component));
}

export default withContacts;