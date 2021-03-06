import React, { useRef, useState } from 'react';
import { Select } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import ContextTitle from 'components/contexts/ContextTitle';
import FolderTitle from 'components/folders/FolderTitle';
import GoalTitle from 'components/goals/GoalTitle';
import LocationTitle from 'components/locations/LocationTitle';
import PriorityTitle from 'components/priorities/PriorityTitle';
import StatusTitle from 'components/statuses/StatusTitle';
import TagsTitle from 'components/tags/TagsTitle';
import TaskTemplateTitle from 'components/tasktemplates/TaskTemplateTitle';
import withBusyCheck from 'containers/WithBusyCheck';
import { useAppApi } from 'hooks/UseAppApi';
import { useContextApi } from 'hooks/UseContextApi';
import { useFolderApi } from 'hooks/UseFolderApi';
import { useGoalApi } from 'hooks/UseGoalApi';
import { useLocationApi } from 'hooks/UseLocationApi';
import { usePriorityApi } from 'hooks/UsePriorityApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useStatusApi } from 'hooks/UseStatusApi';
import { useTagApi } from 'hooks/UseTagApi';
import { useTaskTemplateApi } from 'hooks/UseTaskTemplateApi';
import { useTaskApi } from 'hooks/UseTaskApi';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { applyTaskTemplate, applyTaskTemplateFromTaskFilter } from 'utils/TemplateUtils';

function TaskQuickAdd({ apis }) {
    const { appApi, contextApi, folderApi, goalApi, locationApi, priorityApi, settingsApi, statusApi, tagApi, taskApi, taskFieldApi, taskTemplateApi } = apis;

    const [values, setValues] = useState([]);
    const selectRef = useRef(null);

    const onChange = values => {
        if (values.includes('__CREATE__')) {
            onAdd(values.filter(v => v !== '__CREATE__'));
        } else {
            setValues(values);
        }
    };

    const onAdd = async values => {
        const newTask = {
            title: values[0]
        };

        applyTaskTemplate(taskTemplateApi.defaultTaskTemplate, newTask, taskFieldApi.taskFields);
        applyTaskTemplateFromTaskFilter(taskApi.selectedTaskFilter, taskTemplateApi.taskTemplates, newTask, taskFieldApi.taskFields);

        values.forEach((value, index) => {
            value = value.trim();

            if (!value) {
                return;
            }

            if (index === 0) {
                return;
            }

            let object = null;

            try {
                if (value.includes('__')) {
                    const o = JSON.parse(value.substr(value.lastIndexOf('__') + 2));

                    if (typeof o === 'object' && o.field && Object.prototype.hasOwnProperty.call(o, 'value')) {
                        object = o;
                    }
                }
            } catch (e) {
                // Ignore
            }

            if (!object) {
                return;
            }

            switch (object.field) {
                case 'dueDate':
                    newTask.dueDate = moment().add(object.value.amount, object.value.unit).toISOString();
                    break;
                case 'startDate':
                    newTask.startDate = moment().add(object.value.amount, object.value.unit).toISOString();
                    break;
                case 'tags':
                    newTask.tags = [...(newTask.tags || []), object.value];
                    break;
                case 'taskTemplate': {
                    const taskTemplate = taskTemplateApi.taskTemplates.find(taskTemplate => taskTemplate.id === object.value);
                    applyTaskTemplate(taskTemplate, newTask, taskFieldApi.taskFields);
                    break;
                }
                default:
                    newTask[object.field] = object.value;
                    break;
            }
        });

        const task = await taskApi.addTask(newTask);

        taskApi.setSelectedTaskIds(task.id);
        appApi.setEditingCell(task.id, 'title');

        setValues([]);
    };

    return (
        <Select
            ref={selectRef}
            mode={values.length > 0 ? 'multiple' : 'tags'}
            value={values}
            placeholder="Quick add task..."
            onChange={onChange}
            className="joyride-task-quick-add"
            style={{ width: '100%', padding: 3 }}>
            {values.length > 0 ? [
                <Select.Option key="create" value="__CREATE__">
                    <Icon icon="plus" text="Create task" />
                </Select.Option>,
                <Select.Option key="star" value={'Star__' + JSON.stringify({ field: 'star', value: true })}>
                    <Icon icon="star" text="Star" color="#fcde35" />
                </Select.Option>,
                <Select.OptGroup key="contexts" label="Contexts">
                    {contextApi.contexts.map(context => (
                        <Select.Option key={context.id} value={context.title + '__' + JSON.stringify({ field: 'context', value: context.id })}>
                            <ContextTitle contextId={context.id} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>,
                <Select.OptGroup key="folders" label="Folders">
                    {folderApi.nonArchivedFolders.map(folder => (
                        <Select.Option key={folder.id} value={folder.title + '__' + JSON.stringify({ field: 'folder', value: folder.id })}>
                            <FolderTitle folderId={folder.id} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>,
                <Select.OptGroup key="goals" label="Goals">
                    {goalApi.nonArchivedGoals.map(goal => (
                        <Select.Option key={goal.id} value={goal.title + '__' + JSON.stringify({ field: 'goal', value: goal.id })}>
                            <GoalTitle goalId={goal.id} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>,
                <Select.OptGroup key="locations" label="Locations">
                    {locationApi.locations.map(location => (
                        <Select.Option key={location.id} value={location.title + '__' + JSON.stringify({ field: 'location', value: location.id })}>
                            <LocationTitle locationId={location.id} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>,
                <Select.OptGroup key="priorities" label="Priorities">
                    {priorityApi.priorities.map(priority => (
                        <Select.Option key={priority.id} value={priority.title + '__' + JSON.stringify({ field: 'priority', value: priority.id })}>
                            <PriorityTitle priorityId={priority.id} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>,
                <Select.OptGroup key="statuses" label="Statuses">
                    {statusApi.statuses.map(status => (
                        <Select.Option key={status.id} value={status.title + '__' + JSON.stringify({ field: 'status', value: status.id })}>
                            <StatusTitle statusId={status.id} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>,
                <Select.OptGroup key="startDates" label="Start Dates">
                    <Select.Option key={'startDate_today'} value={'Today__' + JSON.stringify({ field: 'startDate', value: { amount: 0, unit: 'day' } })}>
                        <Icon icon="calendar-alt" text="Today" />
                    </Select.Option>
                    {settingsApi.settings.postponeTimeDurations.map(timeDuration => {
                        const title = `Start date in ${timeDuration.amount} ${timeDuration.unit}${timeDuration.amount > 1 ? 's' : ''}`;

                        return (
                            <Select.Option key={'startDate_' + timeDuration.id} value={title + '__' + JSON.stringify({ field: 'startDate', value: timeDuration })}>
                                <Icon icon="calendar-alt" text={title} />
                            </Select.Option>
                        );
                    })}
                </Select.OptGroup>,
                <Select.OptGroup key="dueDates" label="Due Dates">
                    <Select.Option key={'dueDate_today'} value={'Today__' + JSON.stringify({ field: 'dueDate', value: { amount: 0, unit: 'day' } })}>
                        <Icon icon="calendar-alt" text="Today" />
                    </Select.Option>
                    {settingsApi.settings.postponeTimeDurations.map(timeDuration => {
                        const title = `Due date in ${timeDuration.amount} ${timeDuration.unit}${timeDuration.amount > 1 ? 's' : ''}`;

                        return (
                            <Select.Option key={'dueDate_' + timeDuration.id} value={title + '__' + JSON.stringify({ field: 'dueDate', value: timeDuration })}>
                                <Icon icon="calendar-alt" text={title} />
                            </Select.Option>
                        );
                    })}
                </Select.OptGroup>,
                <Select.OptGroup key="taskTemplates" label="Task Templates">
                    {taskTemplateApi.taskTemplates.map(taskTemplate => (
                        <Select.Option key={taskTemplate.id} value={taskTemplate.title + '__' + JSON.stringify({ field: 'taskTemplate', value: taskTemplate.id })}>
                            <TaskTemplateTitle taskTemplateId={taskTemplate.id} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>,
                <Select.OptGroup key="tags" label="Tags">
                    {tagApi.tags.map(tag => (
                        <Select.Option key={tag.id} value={tag.title + '__' + JSON.stringify({ field: 'tags', value: tag.id })}>
                            <TagsTitle tagIds={[tag.id]} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>
            ] : null}
        </Select>
    );
}

TaskQuickAdd.propTypes = {
    apis: PropTypes.object.isRequired
};

export default withBusyCheck(TaskQuickAdd, () => ({
    appApi: useAppApi(),
    contextApi: useContextApi(),
    folderApi: useFolderApi(),
    goalApi: useGoalApi(),
    locationApi: useLocationApi(),
    priorityApi: usePriorityApi(),
    settingsApi: useSettingsApi(),
    statusApi: useStatusApi(),
    tagApi: useTagApi(),
    taskApi: useTaskApi(),
    taskFieldApi: useTaskFieldApi(),
    taskTemplateApi: useTaskTemplateApi()
}));