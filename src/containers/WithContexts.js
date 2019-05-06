import { connect } from 'react-redux';
import { addContext, deleteContext, updateContext } from 'actions/ContextActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { merge } from 'utils/ObjectUtils';

function withContexts(Component, options) {
    options = merge({
        includeState: true,
        includeDispatch: true
    }, options || {});

    const mapStateToProps = state => ({
        contexts: state.contexts.filteredByVisibleState
    });

    const mapDispatchToProps = dispatch => ({
        addContext: context => dispatch(addContext(context)),
        updateContext: context => dispatch(updateContext(context)),
        deleteContext: contextId => dispatch(deleteContext(contextId))
    });

    return connect(
        options.includeState === true ? mapStateToProps : null,
        options.includeDispatch === true ? mapDispatchToProps : null
    )(withBusyCheck(Component));
}

export default withContexts;