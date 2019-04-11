import React from 'react';
import { connect } from 'react-redux';
import { clearProcesses } from '../actions/StatusActions';

function withStatus(Component) {
    function WithStatus(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => ({
        status: state.status
    });

    const mapDispatchToProps = dispatch => ({
        clearProcesses: () => dispatch(clearProcesses())
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithStatus);
}

export default withStatus;