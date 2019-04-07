import React from 'react';
import { connect } from 'react-redux';
import { setStatusVisible } from '../actions/StatusActions';

const mapStateToProps = state => ({
    status: state.status
});

const mapDispatchToProps = dispatch => ({
    setStatusVisible: visible => dispatch(setStatusVisible(visible))
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