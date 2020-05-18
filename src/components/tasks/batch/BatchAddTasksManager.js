import React, { forwardRef, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Form, Input, message } from 'antd';
import TaskTemplateSelect from 'components/tasktemplates/TaskTemplateSelect';
import withBusyCheck from 'containers/WithBusyCheck';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { useTaskTemplateApi } from 'hooks/UseTaskTemplateApi';
import { useTaskApi } from 'hooks/UseTaskApi';
import { getDefaultFormItemLayout, getDefaultTailFormItemLayout } from 'utils/FormUtils';
import { applyTaskTemplate } from 'utils/TemplateUtils';

const BatchAddTasksManager = forwardRef(function BatchAddTasksManager({ apis, form, onSuccess }, ref) {
    const { taskApi, taskFieldApi, taskTemplateApi } = apis;

    const [showExample, setShowExample] = useState(false);

    const addTasks = async () => {
        try {
            const values = await form.validateFields();

            if (values.titles) {
                const taskTemplate = taskTemplateApi.taskTemplates.find(taskTemplate => taskTemplate.id === values.taskTemplate);
                const tokens = values.titles.split('\n');
                const taskSubLevels = [];
                const promises = [];

                let previousSubLevel = -1;
                let previousRawSubLevel = -1;

                tokens.forEach(token => {
                    const match = token.match(/^\s*([-*]*)\s*(.*)\s*$/);

                    if (match[2]) {
                        const task = {};

                        applyTaskTemplate(taskTemplateApi.defaultTaskTemplate, task, taskFieldApi.taskFields);
                        applyTaskTemplate(taskTemplate, task, taskFieldApi.taskFields);

                        task.title = match[2]; // eslint-disable-line prefer-destructuring
                        promises.push(taskApi.addTask(task));

                        let subLevel = match[1].length;

                        if (subLevel > previousRawSubLevel) {
                            subLevel = previousSubLevel + 1;
                        } else if (subLevel < previousRawSubLevel) {
                            subLevel = previousSubLevel + (subLevel - previousRawSubLevel);
                            subLevel = subLevel < 0 ? 0 : subLevel;
                        } else {
                            subLevel = previousSubLevel;
                        }

                        taskSubLevels.push(subLevel);

                        previousSubLevel = subLevel;
                        previousRawSubLevel = match[1].length;
                    }
                });

                const tasks = await Promise.all(promises);

                const parents = [];

                tasks.forEach((task, index) => {
                    parents[taskSubLevels[index]] = task.id;

                    if (taskSubLevels[index] === 0) {
                        return;
                    }

                    taskApi.updateTask({
                        ...task,
                        parent: parents[taskSubLevels[index] - 1]
                    });
                });

                taskApi.setSelectedTaskIds(tasks.map(task => task.id));

                message.success('Tasks sucessfully added');
                onSuccess();
                form.resetFields();
            }
        } catch (error) {
            // Skip
        }
    };

    useImperativeHandle(ref, () => ({
        addTasks
    }));

    const formItemLayout = getDefaultFormItemLayout();
    const tailFormItemLayout = getDefaultTailFormItemLayout();

    return (
        <Form form={form} {...formItemLayout}>
            <Form.Item {...tailFormItemLayout}>
                <Alert
                    type="info"
                    showIcon
                    message={showExample ?
                        (
                            <div>
                                <span>You can use a dash (-) before the title to create subtasks.</span>
                                &nbsp;<Button size="small" onClick={() => setShowExample(false)}>Hide example</Button>
                                <br />
                                <span>Task 1<br />- Task 1.1<br />-- Task 1.1.1<br />- Task 1.2<br />Task 2</span>
                            </div>
                        ) : (
                            <div>
                                <span>You can use a dash (-) before the title to create subtasks.</span>
                                &nbsp;<Button size="small" onClick={() => setShowExample(true)}>Show example</Button>
                            </div>
                        )} />
            </Form.Item>
            <Form.Item
                name="titles"
                label="Titles (each task on a separate line)"
                rules={[
                    {
                        required: true,
                        message: 'The titles are required'
                    }
                ]}>
                <Input.TextArea autoSize={{ minRows: 5 }} />
            </Form.Item>
            <Form.Item
                name="taskTemplate"
                label="Task Template">
                <TaskTemplateSelect />
            </Form.Item>
        </Form>
    );
});

BatchAddTasksManager.displayName = 'BatchAddTasksManager';

BatchAddTasksManager.propTypes = {
    apis: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired
};

export default withBusyCheck(BatchAddTasksManager, () => ({
    taskApi: useTaskApi(),
    taskFieldApi: useTaskFieldApi(),
    taskTemplateApi: useTaskTemplateApi()
}));