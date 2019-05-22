import { connect } from 'react-redux';
import { updateTask } from 'actions/TaskActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { getTaskReminders } from 'selectors/TaskSelectors';
import { merge } from 'utils/ObjectUtils';

function withTaskReminders(Component, options) {
    options = merge({
        includeState: true,
        includeDispatch: true
    }, options || {});

    const mapStateToProps = (state, ownProps) => ({
        tasks: getTaskReminders(state, ownProps)
    });

    const mapDispatchToProps = dispatch => ({
        updateTask: task => dispatch(updateTask(task))
    });

    return connect(
        options.includeState === true ? mapStateToProps : null,
        options.includeDispatch === true ? mapDispatchToProps : null
    )(withBusyCheck(Component));
}

export default withTaskReminders;