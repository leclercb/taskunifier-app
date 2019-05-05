import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';

function withContact(Component, propertyId = 'contactId') {
    const mapStateToProps = (state, ownProps) => ({
        contact: state.contacts.filteredByVisibleState.find(contact => contact.id === ownProps[propertyId])
    });

    const mapDispatchToProps = () => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withContact;