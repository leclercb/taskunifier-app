import React, { forwardRef, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Form, Input, message } from 'antd';
import { getDefaultFormItemLayout, getDefaultTailFormItemLayout } from 'utils/FormUtils';
import TaskTemplateSelect from 'components/tasktemplates/TaskTemplateSelect';
import { useTaskTemplateApi } from 'hooks/UseTaskTemplateApi';
import { useTaskApi } from 'hooks/UseTaskApi';
import { applyTaskTemplate } from 'utils/TaskTemplateUtils';

export const BatchAddTasksManager = forwardRef(function BatchAddTasksManager({ form, onSuccess }, ref) {
    const taskApi = useTaskApi();
    const taskTemplatesApi = useTaskTemplateApi();

    const [showExample, setShowExample] = useState(false);

    const addTasks = () => {
        form.validateFields(async (error, values) => {
            if (error) {
                return;
            }

            if (values.titles) {
                const taskTemplate = taskTemplatesApi.taskTemplates.find(taskTemplate => taskTemplate.id === values.taskTemplate);
                const tokens = values.titles.split('\n');
                const taskSubLevels = [];
                const promises = [];

                let previousSubLevel = -1;
                let previousRawSubLevel = -1;

                tokens.forEach(token => {
                    const match = token.match(/^\s*([-*]*)\s*(.*)\s*$/);

                    if (match[2]) {
                        const task = {};
                        applyTaskTemplate(taskTemplate, task);
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
        });
    };

    useImperativeHandle(ref, () => ({
        addTasks
    }));

    const { getFieldDecorator } = form;

    const formItemLayout = getDefaultFormItemLayout();
    const tailFormItemLayout = getDefaultTailFormItemLayout();

    return (
        <Form {...formItemLayout}>
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
            <Form.Item label="Titles (each task on a separate line)">
                {getFieldDecorator('titles', {
                    initialValue: null,
                    rules: [
                        {
                            required: true,
                            message: 'The titles are required'
                        }
                    ]
                })(
                    <Input.TextArea autoSize={{ minRows: 5 }} />
                )}
            </Form.Item>
            <Form.Item label="Task Template">
                {getFieldDecorator('taskTemplate', {
                    initialValue: null
                })(
                    <TaskTemplateSelect />
                )}
            </Form.Item>
        </Form>
    );
});

BatchAddTasksManager.displayName = 'BatchAddTasksManager';

BatchAddTasksManager.propTypes = {
    form: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired
};

export default Form.create({ name: 'batchAddTasks' })(BatchAddTasksManager);