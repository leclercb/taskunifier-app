import React from 'react';
import PropTypes from 'prop-types';
import { TaskPropType } from 'proptypes/TaskPropTypes';
import withTask from 'containers/WithTask';
import withSettings from 'containers/WithSettings';
import Icon from 'components/common/Icon';
import { getImportanceColor, getPriorityColor } from 'utils/SettingUtils';

export function TaskTitle(props) {
    const task = props.task;

    return task ? (
        <Icon
            icon="circle"
            color={getPriorityColor(task.priority, props.settings)}
            text={task.title}
            globalStyle={{
                backgroundColor: getImportanceColor(task.importance, props.settings),
                borderRadius: 4,
                padding: '2px 8px'
            }} />
    ) : <span>&nbsp;</span>;
}

TaskTitle.propTypes = {
    taskId: PropTypes.string,
    task: TaskPropType,
    settings: PropTypes.object.isRequired
};

export default withSettings(withTask(TaskTitle));