import React from 'react';
import { connect } from 'react-redux';
import { setSelectedFilter, synchronize, loadData, saveData, setManageCategoriesVisible } from '../actions/AppActions';
import { setSettingsVisible } from '../actions/SettingActions';
import { clearProcesses } from '../actions/StatusActions';

const mapStateToProps = state => ({
    selectedFilter: state.app.selectedFilter,
    manageCategoriesVisible: state.app.manageCategoriesVisible
})

const mapDispatchToProps = dispatch => ({
    loadData: () => dispatch(loadData()),
    saveData: () => dispatch(saveData()),
    synchronize: () => dispatch(synchronize()),
    setSelectedFilter: filter => dispatch(setSelectedFilter(filter)),
    setSettingsVisible: visible => dispatch(setSettingsVisible(visible)),
    setManageCategoriesVisible: visible => dispatch(setManageCategoriesVisible(visible)),
    clearProcesses: () => dispatch(clearProcesses())
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