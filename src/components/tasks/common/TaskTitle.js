import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import withSettings from 'containers/WithSettings';
import Icon from 'components/common/Icon';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { getVisibleTask } from 'selectors/TaskSelectors';
import { getImportanceColor, getPriorityColor } from 'utils/SettingUtils';

export function TaskTitle(props) {
    const task = useSelector(state => getVisibleTask(state, props.taskId));

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
    settings: SettingsPropType.isRequired,
    style: PropTypes.object
};

export default withSettings(TaskTitle);