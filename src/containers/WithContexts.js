import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    contexts: state.contexts
})

const mapDispatchToProps = dispatch => ({

});

function withContexts(Component) {
    function WithContexts(props) {
        return <Component {...props} />
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithContexts);
}

export default withContexts;