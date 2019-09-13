import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTask } from 'hooks/UseTask';
import { getImportanceColor, getPriorityColor } from 'utils/SettingUtils';

export function TaskTitle(props) {
    const settingsApi = useSettingsApi();
    const task = useTask(props.taskId);

    return task ? (
        <Icon
            icon="circle"
            color={getPriorityColor(task.priority, settingsApi.settings)}
            text={task.title}
            globalStyle={{
                backgroundColor: getImportanceColor(task.importance, settingsApi.settings),
                borderRadius: 4,
                padding: '2px 8px',
                ...props.style
            }} />
    ) : <span>&nbsp;</span>;
}

TaskTitle.propTypes = {
    taskId: PropTypes.string,
    style: PropTypes.object
};

export default TaskTitle;