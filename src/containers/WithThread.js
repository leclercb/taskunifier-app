import { connect } from 'react-redux';
import { clearProcesses, deleteNotification, setThreadManagerVisible } from 'actions/ThreadActions';
import { getNotifications, getProcesses, isThreadManagerVisible } from 'selectors/ThreadSelectors';

function withProcesses(Component) {
    const mapStateToProps = state => ({
        threadManagerVisible: isThreadManagerVisible(state),
        processes: getProcesses(state),
        notifications: getNotifications(state)
    });

    const mapDispatchToProps = dispatch => ({
        setThreadManagerVisible: visible => dispatch(setThreadManagerVisible(visible)),
        clearProcesses: () => dispatch(clearProcesses()),
        deleteNotification: notificationId => dispatch(deleteNotification(notificationId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(Component);
}

export default withProcesses;