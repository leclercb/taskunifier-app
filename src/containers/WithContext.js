import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';
import { getContextsFilteredByVisibleState } from 'selectors/ContextSelectors';

function withContext(Component, getId = ownProps => ownProps.contextId) {
    const mapStateToProps = (state, ownProps) => ({
        context: getContextsFilteredByVisibleState(state).find(context => context.id === getId(ownProps))
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(Component));
}

export default withContext;