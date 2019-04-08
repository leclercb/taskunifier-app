import React from 'react';
import { connect } from 'react-redux';
import { clearProcesses } from '../actions/StatusActions';

const mapStateToProps = state => ({
    status: state.status
});

const mapDispatchToProps = dispatch => ({
    clearProcesses: () => dispatch(clearProcesses())
});

function withStatus(Component) {
    function WithStatus(props) {
        return <Component {...props} />
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithStatus);
}

export default withStatus;