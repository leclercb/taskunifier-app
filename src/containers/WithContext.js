import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';

function withContext(Component, propertyId = 'contextId') {
    const mapStateToProps = (state, ownProps) => ({
        context: state.contexts.filteredByVisibleState.find(context => context.id === ownProps[propertyId])
    });

    const mapDispatchToProps = () => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withContext;