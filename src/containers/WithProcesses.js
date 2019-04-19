import React from 'react';
import { connect } from 'react-redux';
import { clearProcesses, setProcessesVisible, deleteNotification } from '../actions/ProcessActions';

function withProcesses(Component) {
    function WithProcesses(props) {
        return <Component {...props} />
    }

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
    )(WithProcesses);
}

export default withProcesses;