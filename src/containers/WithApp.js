import React from 'react';
import { connect } from 'react-redux';
import { setSelectedFilter, synchronize, loadData, saveData } from '../actions/AppActions';

const mapStateToProps = state => ({
    selectedFilter: state.app.selectedFilter
})

const mapDispatchToProps = dispatch => ({
    loadData: () => dispatch(loadData()),
    saveData: () => dispatch(saveData()),
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