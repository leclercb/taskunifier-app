import { connect } from 'react-redux';
import { addContext, deleteContext, updateContext } from 'actions/ContextActions';
import { filterObjects } from 'utils/CategoryUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withContexts(Component, options = { actionsOnly: false }) {
    const mapStateToProps = state => {
        if (options && options.actionsOnly === true) {
            return {};
        }

        return {
            contexts: filterObjects(state.contexts.all)
        };
    };

    const mapDispatchToProps = dispatch => ({
        addContext: context => dispatch(addContext(context)),
        updateContext: context => dispatch(updateContext(context)),
        deleteContext: contextId => dispatch(deleteContext(contextId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withContexts;