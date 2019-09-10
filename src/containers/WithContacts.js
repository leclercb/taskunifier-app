import { connect } from 'react-redux';
import { addContact, deleteContact, duplicateContact, updateContact } from 'actions/ContactActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { getContactsFilteredByVisibleState } from 'selectors/ContactSelectors';
import { merge } from 'utils/ObjectUtils';

function withContacts(Component, options) {
    options = merge({
        includeState: true,
        includeDispatch: true
    }, options || {});

    const mapStateToProps = state => ({
        contacts: getContactsFilteredByVisibleState(state)
    });

    const mapDispatchToProps = dispatch => ({
        addContact: contact => dispatch(addContact(contact)),
        duplicateContact: contact => dispatch(duplicateContact(contact)),
        updateContact: contact => dispatch(updateContact(contact)),
        deleteContact: contactId => dispatch(deleteContact(contactId))
    });

    return connect(
        options.includeState === true ? mapStateToProps : null,
        options.includeDispatch === true ? mapDispatchToProps : null
    )(withBusyCheck(Component));
}

export default withContacts;