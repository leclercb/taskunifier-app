import React from 'react';
import PropTypes from 'prop-types';
import withTask from 'containers/WithTask';
import withSettings from 'containers/WithSettings';
import Icon from 'components/common/Icon';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { TaskPropType } from 'proptypes/TaskPropTypes';
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
                padding: '2px 8px',
                ...props.style
            }} />
    ) : <span>&nbsp;</span>;
}

TaskTitle.propTypes = {
    taskId: PropTypes.string,
    task: TaskPropType,
    settings: SettingsPropType.isRequired,
    style: PropTypes.object
};

export default withSettings(withTask(TaskTitle));