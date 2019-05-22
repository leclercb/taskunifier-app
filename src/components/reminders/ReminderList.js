import React, { useState } from 'react';
import { Button, List } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import Spacer from 'components/common/Spacer';
import TaskTitle from 'components/tasks/common/TaskTitle';
import withSettings from 'containers/WithSettings';
import withTaskReminders from 'containers/WithTaskReminders';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { TaskPropType } from 'proptypes/TaskPropTypes';
import { showReminder } from 'utils/ReminderUtils';
import { formatDate } from 'utils/SettingUtils';

function ReminderList(props) {
    const [selectedTaskId, setSelectedTaskId] = useState([]);

    const dismiss = task => {
        const newTask = {
            ...task
        };

        let showStartDateReminder = showReminder(task.startDate, task.startDateReminder);
        let showDueDateReminder = showReminder(task.dueDate, task.dueDateReminder);

        if (showStartDateReminder) {
            newTask.startDateReminder = null;
        }

        if (showDueDateReminder) {
            newTask.dueDateReminder = null;
        }

        props.updateTask(newTask);
    };

    const onDismiss = () => {
        const task = props.tasks.find(task => task.id === selectedTaskId);

        if (task) {
            dismiss(task);
        }
    };

    const onDismissAll = () => {
        props.tasks.forEach(task => dismiss(task));
    };

    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.tasks}
                style={{ minHeight: 300, maxHeight: 300, overflowY: 'auto' }}
                renderItem={task => {
                    const startDate = task.startDate ? formatDate(task.startDate, props.settings, props.settings.showStartTime) : 'none';
                    const dueDate = task.dueDate ? formatDate(task.dueDate, props.settings, props.settings.showDueTime) : 'none';

                    let showStartDateReminder = showReminder(task.startDate, task.startDateReminder);
                    let showDueDateReminder = showReminder(task.dueDate, task.dueDateReminder);

                    return (
                        <List.Item
                            key={task.id}
                            onClick={() => setSelectedTaskId(task.id)}
                            className={selectedTaskId === task.id ? 'selected-list-item' : null}>
                            <List.Item.Meta
                                title={<TaskTitle taskId={task.id} />}
                                description={(
                                    <React.Fragment>
                                        <Icon
                                            icon="bell"
                                            color={showStartDateReminder ? '#ff8c00' : 'transparent'}
                                            text={`Start date: ${startDate}`} />
                                        <br />
                                        <Icon
                                            icon="bell"
                                            color={showDueDateReminder ? '#ff8c00' : 'transparent'}
                                            text={`Due date: ${dueDate}`} />
                                    </React.Fragment>
                                )} />
                        </List.Item>
                    );
                }}
            />
            <Button
                onClick={() => onDismiss()}
                style={{ marginTop: 5 }}
                disabled={!props.tasks.find(task => task.id === selectedTaskId)}>
                <Icon icon="eye-slash" text="Dismiss" />
            </Button>
            <Spacer />
            <Button
                onClick={() => onDismissAll()}
                style={{ marginTop: 5 }}>
                <Icon icon="eye-slash" text="Dismiss All" />
            </Button>
        </React.Fragment>
    );
}

ReminderList.propTypes = {
    date: PropTypes.string.isRequired,
    tasks: PropTypes.arrayOf(TaskPropType.isRequired).isRequired,
    settings: SettingsPropType.isRequired,
    updateTask: PropTypes.func.isRequired
};

export default withSettings(withTaskReminders(ReminderList));