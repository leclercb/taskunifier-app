import React from 'react';
import { connect } from 'react-redux'
import { setSelectedFilter, synchronize } from '../actions/AppActions'

const mapStateToProps = state => ({
    selectedFilter: state.app ? state.app.selectedFilter : null
})

const mapDispatchToProps = dispatch => ({
    synchronize: () => dispatch(synchronize()),
    setSelectedFilter: filter => dispatch(setSelectedFilter(filter))
})

function withApp(Component) {
    function WithApp(props) {
        return <Component {...props} />
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithApp);
}

export default withApp;