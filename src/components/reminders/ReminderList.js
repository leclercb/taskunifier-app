import React, { useState } from 'react';
import { Button, List, Menu, Popover } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import Spacer from 'components/common/Spacer';
import TaskTitle from 'components/tasks/common/TaskTitle';
import withBusyCheck from 'containers/WithBusyCheck';
import { useTaskReminderApi } from 'hooks/UseTaskReminderApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { showReminder } from 'utils/ReminderUtils';
import { formatDate } from 'utils/SettingUtils';

function ReminderList({ apis }) {
    const { settingsApi, taskReminderApi } = apis;

    const [selectedTaskId, setSelectedTaskId] = useState([]);
    const [snoozeMenuVisible, setSnoozeMenuVisible] = useState(false);
    const [snoozeAllMenuVisible, setSnoozeAllMenuVisible] = useState(false);

    const onDismiss = () => {
        const task = taskReminderApi.tasks.find(task => task.id === selectedTaskId);

        if (task) {
            taskReminderApi.addDismissedTaskId(task.id);
        }
    };

    const onDismissAll = () => {
        taskReminderApi.tasks.forEach(task => taskReminderApi.addDismissedTaskId(task.id));
    };

    const onSnooze = item => {
        const task = taskReminderApi.tasks.find(task => task.id === selectedTaskId);

        if (task) {
            taskReminderApi.snoozeTask(task, item);
        }

        setSnoozeMenuVisible(false);
    };

    const onSnoozeAll = item => {
        taskReminderApi.tasks.forEach(task => taskReminderApi.snoozeTask(task, item));

        setSnoozeAllMenuVisible(false);
    };

    const createSnoozeMenu = callback => (
        <Menu
            onClick={event => callback(JSON.parse(event.key))}
            style={{ width: 240 }}
            mode="vertical"
            theme="light">
            <Menu.Item key={JSON.stringify({ amount: 5, unit: 'minute' })}>5 minutes</Menu.Item>
            <Menu.Item key={JSON.stringify({ amount: 10, unit: 'minute' })}>10 minutes</Menu.Item>
            <Menu.Item key={JSON.stringify({ amount: 15, unit: 'minute' })}>15 minutes</Menu.Item>
            <Menu.Item key={JSON.stringify({ amount: 20, unit: 'minute' })}>20 minutes</Menu.Item>
            <Menu.Item key={JSON.stringify({ amount: 30, unit: 'minute' })}>30 minutes</Menu.Item>
            <Menu.Item key={JSON.stringify({ amount: 45, unit: 'minute' })}>45 minutes</Menu.Item>
            <Menu.Item key={JSON.stringify({ amount: 1, unit: 'hour' })}>1 hour</Menu.Item>
            <Menu.Item key={JSON.stringify({ amount: 2, unit: 'hour' })}>2 hours</Menu.Item>
            <Menu.Item key={JSON.stringify({ amount: 1, unit: 'day' })}>1 day</Menu.Item>
        </Menu>
    );

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

                    const showStartDateReminder = showReminder(task.startDate, task.startDateReminder);
                    const showDueDateReminder = showReminder(task.dueDate, task.dueDateReminder);

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
                style={{ marginTop: 5 }}
                disabled={taskReminderApi.tasks.length === 0}>
                <Icon icon="eye-slash" text="Dismiss All" />
            </Button>
            <Spacer />
            <Popover
                content={createSnoozeMenu(onSnooze)}
                title="Snooze"
                placement="bottom"
                trigger="click"
                visible={snoozeMenuVisible}
                onVisibleChange={visible => setSnoozeMenuVisible(visible)}>
                <Button
                    style={{ marginTop: 5 }}
                    disabled={!taskReminderApi.tasks.find(task => task.id === selectedTaskId)}>
                    <Icon icon="bell" text="Snooze" />
                </Button>
            </Popover>
            <Spacer />
            <Popover
                content={createSnoozeMenu(onSnoozeAll)}
                title="Snooze All"
                placement="bottom"
                trigger="click"
                visible={snoozeAllMenuVisible}
                onVisibleChange={visible => setSnoozeAllMenuVisible(visible)}>
                <Button
                    style={{ marginTop: 5 }}
                    disabled={taskReminderApi.tasks.length === 0}>
                    <Icon icon="bell" text="Snooze All" />
                </Button>
            </Popover>
        </React.Fragment>
    );
}

ReminderList.propTypes = {
    apis: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired
};

export default withBusyCheck(ReminderList, ({ date }) => ({
    settingsApi: useSettingsApi(),
    taskReminderApi: useTaskReminderApi(date)
}));