import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';
import { getContactsFilteredByVisibleState } from 'selectors/ContactSelectors';

function withContact(Component, getId = ownProps => ownProps.contactId) {
    const mapStateToProps = (state, ownProps) => ({
        contact: getContactsFilteredByVisibleState(state).find(contact => contact.id === getId(ownProps))
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(Component));
}

export default withContact;