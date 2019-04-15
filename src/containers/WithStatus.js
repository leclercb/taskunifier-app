import React from 'react';
import { connect } from 'react-redux';
import { clearProcesses, setStatusVisible, deleteNotification } from '../actions/StatusActions';

function withStatus(Component) {
    function WithStatus(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => ({
        status: state.status
    });

    const mapDispatchToProps = dispatch => ({
        setStatusVisible: visible => dispatch(setStatusVisible(visible)),
        clearProcesses: () => dispatch(clearProcesses()),
        deleteNotification: notificationId => dispatch(deleteNotification(notificationId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithStatus);
}

export default withStatus;