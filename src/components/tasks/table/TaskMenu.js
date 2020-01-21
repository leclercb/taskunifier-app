import React, { useState } from 'react';
import { Dropdown, Menu } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useAppApi } from 'hooks/UseAppApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTaskApi } from 'hooks/UseTaskApi';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { useTaskTemplateApi } from 'hooks/UseTaskTemplateApi';
import { TaskPropType } from 'proptypes/TaskPropTypes';
import { applyTaskTemplate, applyTaskTemplateFromTaskFilter } from 'utils/TaskTemplateUtils';

function TaskMenu({ selectedTasks, children }) {
    const appApi = useAppApi();
    const settingsApi = useSettingsApi();
    const taskApi = useTaskApi();
    const taskFieldApi = useTaskFieldApi();
    const taskTemplateApi = useTaskTemplateApi();

    const [visible, setVisible] = useState(false);

    const onClick = ({ item }) => {
        if (item.props.action) {
            const action = item.props.action;

            switch (action.type) {
                case 'addSubTask':
                    onAddSubTask();
                    break;
                case 'batchEdit':
                    onBatchEditTask();
                    break;
                case 'edit':
                    selectedTasks.forEach(task => onEditTask(task));
                    break;
                case 'moveOutOfParentTask':
                    selectedTasks.forEach(task => onMoveOutOfParentTask(task));
                    break;
                case 'duplicate':
                    selectedTasks.forEach(task => onDuplicateTask(task));
                    break;
                case 'remove':
                    onRemoveTasks(selectedTasks.map(task => task.id));
                    break;
                case 'postponeStartDate':
                    selectedTasks.forEach(task => onPostponeStartDate(task, action.amount, action.unit));
                    break;
                case 'postponeDueDate':
                    selectedTasks.forEach(task => onPostponeDueDate(task, action.amount, action.unit));
                    break;
                default:
                    break;
            }
        }

        setVisible(false);
    };

    const onAddSubTask = async () => {
        let task = {};

        applyTaskTemplate(taskTemplateApi.defaultTaskTemplate, task, taskFieldApi.taskFields);
        applyTaskTemplateFromTaskFilter(taskApi.selectedTaskFilter, taskTemplateApi.taskTemplates, task, taskFieldApi.taskFields);

        task.parent = selectedTasks[0].id;
        task.context = selectedTasks[0].context;
        task.folder = selectedTasks[0].folder;
        task.goal = selectedTasks[0].goal;
        task.location = selectedTasks[0].location;

        task = await taskApi.addTask(task);
        taskApi.setSelectedTaskIds(task.id);

        if (settingsApi.settings.openTaskEditionManagerWhenTaskAdded) {
            appApi.setTaskEditionManagerOptions({
                visible: true,
                taskId: task.id
            });
        } else {
            appApi.setEditingCell(task.id, 'title');
        }
    };

    const onBatchEditTask = () => {
        appApi.setBatchEditTasksManagerOptions({
            visible: true
        });
    };

    const onEditTask = task => {
        appApi.setTaskEditionManagerOptions({
            visible: true,
            taskId: task.id
        });
    };

    const onMoveOutOfParentTask = task => {
        taskApi.updateTask({
            ...task,
            parent: null
        });
    };

    const onDuplicateTask = task => {
        taskApi.duplicateTask(task);
    };

    const onRemoveTasks = taskIds => {
        taskApi.deleteTask(taskIds);
    };

    const onPostponeStartDate = (task, amount, unit) => {
        taskApi.updateTask({
            ...task,
            startDate: moment(task.startDate ? task.startDate : undefined).add(amount, unit).toISOString()
        });
    };

    const onPostponeDueDate = (task, amount, unit) => {
        taskApi.updateTask({
            ...task,
            dueDate: moment(task.dueDate ? task.dueDate : undefined).add(amount, unit).toISOString()
        });
    };

    const createPostponeMenu = (key, title) => (
        <Menu.SubMenu
            key={key}
            title={(<Icon icon="calendar-alt" text={title} />)}>
            <Menu.Item key={`${key}_1d`} action={{ type: key, amount: 1, unit: 'day' }}>
                <Icon icon="calendar-alt" text="Add 1 day" />
            </Menu.Item>
            <Menu.Item key={`${key}_2d`} action={{ type: key, amount: 2, unit: 'day' }}>
                <Icon icon="calendar-alt" text="Add 2 days" />
            </Menu.Item>
            <Menu.Item key={`${key}_3d`} action={{ type: key, amount: 3, unit: 'day' }}>
                <Icon icon="calendar-alt" text="Add 3 days" />
            </Menu.Item>
            <Menu.Item key={`${key}_4d`} action={{ type: key, amount: 4, unit: 'day' }}>
                <Icon icon="calendar-alt" text="Add 4 days" />
            </Menu.Item>
            <Menu.Item key={`${key}_5d`} action={{ type: key, amount: 5, unit: 'day' }}>
                <Icon icon="calendar-alt" text="Add 5 days" />
            </Menu.Item>
            <Menu.Item key={`${key}_6d`} action={{ type: key, amount: 6, unit: 'day' }}>
                <Icon icon="calendar-alt" text="Add 6 days" />
            </Menu.Item>
            <Menu.Item key={`${key}_1w`} action={{ type: key, amount: 1, unit: 'week' }}>
                <Icon icon="calendar-alt" text="Add 1 week" />
            </Menu.Item>
            <Menu.Item key={`${key}_2w`} action={{ type: key, amount: 2, unit: 'week' }}>
                <Icon icon="calendar-alt" text="Add 2 weeks" />
            </Menu.Item>
            <Menu.Item key={`${key}_3w`} action={{ type: key, amount: 3, unit: 'week' }}>
                <Icon icon="calendar-alt" text="Add 3 weeks" />
            </Menu.Item>
            <Menu.Item key={`${key}_1m`} action={{ type: key, amount: 1, unit: 'month' }}>
                <Icon icon="calendar-alt" text="Add 1 month" />
            </Menu.Item>
            <Menu.Item key={`${key}_2m`} action={{ type: key, amount: 2, unit: 'month' }}>
                <Icon icon="calendar-alt" text="Add 2 months" />
            </Menu.Item>
        </Menu.SubMenu>
    );

    const suffix = `${selectedTasks.length} task${selectedTasks.length > 1 ? 's' : ''}`;

    const menu = (
        <Menu
            onClick={onClick}
            style={{ width: 300 }}>
            {selectedTasks.length === 1 && (
                <Menu.Item key="addSubTask" action={{ type: 'addSubTask' }}>
                    <Icon icon="plus" text="Add sub-task" />
                </Menu.Item>
            )}
            {selectedTasks.length > 1 ?
                (
                    <Menu.Item key="batchEdit" action={{ type: 'batchEdit' }}>
                        <Icon icon="magic" text={`Batch edit ${suffix}`} />
                    </Menu.Item>
                ) :
                (
                    <Menu.Item key="edit" action={{ type: 'edit' }}>
                        <Icon icon="edit" text={`Edit ${suffix}`} />
                    </Menu.Item>
                )
            }
            <Menu.Item key="moveOutOfParentTask" action={{ type: 'moveOutOfParentTask' }}>
                <Icon icon="trash-alt" text="Move out of parent task" />
            </Menu.Item>
            <Menu.Item key="duplicate" action={{ type: 'duplicate' }}>
                <Icon icon="copy" text={`Duplicate ${suffix}`} />
            </Menu.Item>
            <Menu.Divider />
            {createPostponeMenu('postponeStartDate', `Postpone start date of ${suffix}`)}
            {createPostponeMenu('postponeDueDate', `Postpone due date of ${suffix}`)}
            <Menu.Divider />
            <Menu.Item key="remove" action={{ type: 'remove' }}>
                <Icon icon="trash-alt" text={`Remove ${suffix}`} />
            </Menu.Item>
        </Menu>

    );

    // Dropdown trigger is not working in React Virtualized Grid
    return (
        <div
            onClick={() => setVisible(false)}
            onContextMenu={event => {
                setVisible(true);
                event.preventDefault();
            }}
            style={{ flexGrow: 1 }}>
            <Dropdown
                overlay={menu}
                trigger={['contextMenu']}
                visible={visible}
                onVisibleChange={setVisible}>
                {children}
            </Dropdown>
        </div>
    );
}

TaskMenu.propTypes = {
    selectedTasks: PropTypes.arrayOf(TaskPropType.isRequired).isRequired,
    children: PropTypes.node.isRequired
};

export default TaskMenu;