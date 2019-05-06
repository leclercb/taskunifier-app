import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';

function withContext(Component, getId = ownProps => ownProps.contextId) {
    const mapStateToProps = (state, ownProps) => ({
        context: state.contexts.filteredByVisibleState.find(context => context.id === getId(ownProps))
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(Component));
}

export default withContext;