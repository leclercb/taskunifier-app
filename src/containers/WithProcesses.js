import { connect } from 'react-redux';
import { clearProcesses, deleteNotification, setProcessesVisible } from 'actions/ProcessActions';
import withBusyCheck from 'containers/WithBusyCheck';

function withProcesses(Component) {
    const mapStateToProps = state => ({
        processes: state.processes
    });

    const mapDispatchToProps = dispatch => ({
        setProcessesVisible: visible => dispatch(setProcessesVisible(visible)),
        clearProcesses: () => dispatch(clearProcesses()),
        deleteNotification: notificationId => dispatch(deleteNotification(notificationId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withProcesses;