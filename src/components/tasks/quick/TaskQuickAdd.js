import React, { useRef, useState } from 'react';
import { Select } from 'antd';
import Icon from 'components/common/Icon';
import { ContextTitle } from 'components/contexts/ContextTitle';
import { FolderTitle } from 'components/folders/FolderTitle';
import { GoalTitle } from 'components/goals/GoalTitle';
import { LocationTitle } from 'components/locations/LocationTitle';
import { TaskTemplateTitle } from 'components/tasktemplates/TaskTemplateTitle';
import { useAppApi } from 'hooks/UseAppApi';
import { useContextApi } from 'hooks/UseContextApi';
import { useFolderApi } from 'hooks/UseFolderApi';
import { useGoalApi } from 'hooks/UseGoalApi';
import { useLocationApi } from 'hooks/UseLocationApi';
import { useTaskTemplateApi } from 'hooks/UseTaskTemplateApi';
import { useTaskApi } from 'hooks/UseTaskApi';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { applyTaskTemplate, applyTaskTemplateFromTaskFilter } from 'utils/TaskTemplateUtils';

function TaskQuickAdd() {
    const appApi = useAppApi();
    const contextApi = useContextApi();
    const folderApi = useFolderApi();
    const goalApi = useGoalApi();
    const locationApi = useLocationApi();
    const taskApi = useTaskApi();
    const taskFieldApi = useTaskFieldApi();
    const taskTemplateApi = useTaskTemplateApi();

    const [values, setValues] = useState([]);
    const [open, setOpen] = useState(false);
    const selectRef = useRef(null);

    const onChange = values => {
        if (values.includes('__ADD__')) {
            onAdd(values.filter(v => v !== '__ADD__'));
        } else {
            setValues(values);
        }
    };

    const onKeyInputDown = () => {
        setOpen(true);
    };

    const onFocus = () => {
        if (values.length > 0) {
            setOpen(true);
        }
    };

    const onBlur = () => {
        setOpen(false);
    };

    const onAdd = async values => {
        const newTask = {
            title: values[0]
        };

        applyTaskTemplate(taskTemplateApi.defaultTaskTemplate, newTask, taskFieldApi.taskFields);
        applyTaskTemplateFromTaskFilter(taskApi.selectedTaskFilter, taskTemplateApi.taskTemplates, newTask, taskFieldApi.taskFields);

        values.forEach((value, index) => {
            if (index === 0) {
                return;
            }

            const object = JSON.parse(value.substr(value.lastIndexOf('__') + 2));

            if (object.field === 'taskTemplate') {
                const taskTemplate = taskTemplateApi.taskTemplates.find(taskTemplate => taskTemplate.id === object.value);
                applyTaskTemplate(taskTemplate, newTask, taskFieldApi.taskFields);
            } else {
                newTask[object.field] = object.value;
            }
        });

        const task = await taskApi.addTask(newTask);

        taskApi.setSelectedTaskIds(task.id);
        appApi.setEditingCell(task.id, 'title');

        setValues([]);
        setTimeout(() => setOpen(false));
    };

    return (
        <Select
            ref={selectRef}
            mode={values.length > 0 ? 'multiple' : 'tags'}
            value={values}
            placeholder="Quick add task..."
            onChange={onChange}
            onInputKeyDown={onKeyInputDown}
            onFocus={onFocus}
            onBlur={onBlur}
            open={open}
            className="joyride-task-quick-add"
            style={{ width: '100%', padding: 3 }}>
            {values.length > 0 ? [
                <Select.Option key='add' value="__ADD__">
                    <Icon icon="plus" text="Create task" />
                </Select.Option>,
                <Select.OptGroup key='contexts' label="Contexts">
                    {contextApi.contexts.map(context => (
                        <Select.Option key={context.id} value={context.title + '__' + JSON.stringify({ field: 'context', value: context.id })}>
                            <ContextTitle contextId={context.id} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>,
                <Select.OptGroup key='folders' label="Folders">
                    {folderApi.nonArchivedFolders.map(folder => (
                        <Select.Option key={folder.id} value={folder.title + '__' + JSON.stringify({ field: 'folder', value: folder.id })}>
                            <FolderTitle folderId={folder.id} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>,
                <Select.OptGroup key='goals' label="Goals">
                    {goalApi.nonArchivedGoals.map(goal => (
                        <Select.Option key={goal.id} value={goal.title + '__' + JSON.stringify({ field: 'goal', value: goal.id })}>
                            <GoalTitle goalId={goal.id} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>,
                <Select.OptGroup key='locations' label="Locations">
                    {locationApi.locations.map(location => (
                        <Select.Option key={location.id} value={location.title + '__' + JSON.stringify({ field: 'location', value: location.id })}>
                            <LocationTitle locationId={location.id} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>,
                <Select.OptGroup key='taskTemplates' label="Task Templates">
                    {taskTemplateApi.taskTemplates.map(taskTemplate => (
                        <Select.Option key={taskTemplate.id} value={taskTemplate.title + '__' + JSON.stringify({ field: 'taskTemplate', value: taskTemplate.id })}>
                            <TaskTemplateTitle taskTemplateId={taskTemplate.id} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>
            ] : null}
        </Select>
    );
}

export default TaskQuickAdd;