import { connect } from 'react-redux';
import { filterObjects } from '../utils/CategoryUtils';
import withBusyCheck from '../components/common/WithBusyCheck';

function withContact(Component, propertyId = 'contactId') {
    const mapStateToProps = (state, ownProps) => ({
        busy: state.processes.busy,
        contact: filterObjects(state.contacts).find(contact => contact.id === ownProps[propertyId])
    });

    const mapDispatchToProps = dispatch => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withContact;