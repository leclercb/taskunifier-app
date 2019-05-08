import { connect } from 'react-redux';
import { addTaskTemplate, deleteTaskTemplate, updateTaskTemplate } from 'actions/TaskTemplateActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { getTaskTemplatesFilteredByVisibleState } from 'selectors/TaskTemplateSelectors';
import { merge } from 'utils/ObjectUtils';

function withTaskTemplates(Component, options) {
    options = merge({
        includeState: true,
        includeDispatch: true
    }, options || {});

    const mapStateToProps = state => ({
        taskTemplates: getTaskTemplatesFilteredByVisibleState(state)
    });

    const mapDispatchToProps = dispatch => ({
        addTaskTemplate: taskTemplate => dispatch(addTaskTemplate(taskTemplate)),
        updateTaskTemplate: taskTemplate => dispatch(updateTaskTemplate(taskTemplate)),
        deleteTaskTemplate: taskTemplateId => dispatch(deleteTaskTemplate(taskTemplateId))
    });

    return connect(
        options.includeState === true ? mapStateToProps : null,
        options.includeDispatch === true ? mapDispatchToProps : null
    )(withBusyCheck(Component));
}

export default withTaskTemplates;