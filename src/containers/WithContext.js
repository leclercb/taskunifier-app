import { connect } from 'react-redux';
import { filterObjects } from '../utils/CategoryUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withContext(Component, propertyId = 'contextId') {
    const mapStateToProps = (state, ownProps) => ({
        context: filterObjects(state.contexts).find(context => context.id === ownProps[propertyId])
    });

    const mapDispatchToProps = () => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withContext;