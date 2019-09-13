import React, { useState } from 'react';
import { Button, List } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import Spacer from 'components/common/Spacer';
import TaskTitle from 'components/tasks/common/TaskTitle';
import { useTaskReminderApi } from 'hooks/UseTaskReminderApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { showReminder } from 'utils/ReminderUtils';
import { formatDate } from 'utils/SettingUtils';

function ReminderList(props) {
    const settingsApi = useSettingsApi();
    const taskReminderApi = useTaskReminderApi(props.date);
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

        taskReminderApi.updateTask(newTask);
    };

    const onDismiss = () => {
        const task = taskReminderApi.tasks.find(task => task.id === selectedTaskId);

        if (task) {
            dismiss(task);
        }
    };

    const onDismissAll = () => {
        taskReminderApi.tasks.forEach(task => dismiss(task));
    };

    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={taskReminderApi.tasks}
                style={{ minHeight: 300, maxHeight: 300, overflowY: 'auto' }}
                renderItem={task => {
                    const startDate = task.startDate ? formatDate(task.startDate, settingsApi.settings, settingsApi.settings.showStartTime) : 'none';
                    const dueDate = task.dueDate ? formatDate(task.dueDate, settingsApi.settings, settingsApi.settings.showDueTime) : 'none';

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
                disabled={!taskReminderApi.tasks.find(task => task.id === selectedTaskId)}>
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
    date: PropTypes.string.isRequired
};

export default ReminderList;