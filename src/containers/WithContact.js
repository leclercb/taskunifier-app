import { connect } from 'react-redux';
import { filterObjects } from 'utils/CategoryUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withContact(Component, propertyId = 'contactId') {
    const mapStateToProps = (state, ownProps) => ({
        contact: filterObjects(state.contacts.all).find(contact => contact.id === ownProps[propertyId])
    });

    const mapDispatchToProps = () => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withContact;