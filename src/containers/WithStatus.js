import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    status: state.status
});

const mapDispatchToProps = dispatch => ({

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