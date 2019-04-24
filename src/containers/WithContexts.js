import { connect } from 'react-redux';
import { addContext, updateContext, deleteContext } from '../actions/ContextActions';
import { filterObjects } from '../utils/CategoryUtils';
import withBusyCheck from './WithBusyCheck';

function withContexts(Component, options = { actionsOnly: false }) {
    const mapStateToProps = state => {
        if (options && options.actionsOnly === true) {
            return {};
        }

        return {
            contexts: filterObjects(state.contexts)
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