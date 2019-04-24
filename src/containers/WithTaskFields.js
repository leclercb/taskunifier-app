import { connect } from 'react-redux';
import { addTaskField, deleteTaskField, updateTaskField } from 'actions/TaskFieldActions';
import { getDefaultTaskFields } from 'data/DataTaskFields';
import { filterObjects } from 'utils/CategoryUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withTaskFields(Component) {
    const mapStateToProps = state => ({
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