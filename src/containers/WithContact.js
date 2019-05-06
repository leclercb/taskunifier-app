import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';

function withContact(Component, getId = ownProps => ownProps.contactId) {
    const mapStateToProps = (state, ownProps) => ({
        contact: state.contacts.filteredByVisibleState.find(contact => contact.id === getId(ownProps))
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(Component));
}

export default withContact;