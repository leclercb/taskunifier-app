import { connect } from 'react-redux';
import { addTaskField, updateTaskField, deleteTaskField } from '../actions/TaskFieldActions';
import { getDefaultTaskFields } from '../data/DataTaskFields';
import { filterObjects } from '../utils/CategoryUtils';
import withBusyCheck from '../components/common/WithBusyCheck';

function withTaskFields(Component) {
    const mapStateToProps = state => ({
        busy: state.processes.busy,
        taskFields: getDefaultTaskFields(state.settings).concat(filterObjects(state.taskFields))
    });

    const mapDispatchToProps = dispatch => ({
        addTaskField: field => dispatch(addTaskField(field)),
        updateTaskField: field => dispatch(updateTaskField(field)),
        deleteTaskField: fieldId => dispatch(deleteTaskField(fieldId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withTaskFields;