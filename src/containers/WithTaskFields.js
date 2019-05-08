import { connect } from 'react-redux';
import { addTaskField, deleteTaskField, updateTaskField } from 'actions/TaskFieldActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';
import { merge } from 'utils/ObjectUtils';

function withTaskFields(Component, options) {
    options = merge({
        includeState: true,
        includeDispatch: true
    }, options || {});

    const mapStateToProps = state => ({
        taskFields: getTaskFieldsIncludingDefaults(state)
    });

    const mapDispatchToProps = dispatch => ({
        addTaskField: field => dispatch(addTaskField(field)),
        updateTaskField: field => dispatch(updateTaskField(field)),
        deleteTaskField: fieldId => dispatch(deleteTaskField(fieldId))
    });

    return connect(
        options.includeState === true ? mapStateToProps : null,
        options.includeDispatch === true ? mapDispatchToProps : null
    )(withBusyCheck(Component));
}

export default withTaskFields;