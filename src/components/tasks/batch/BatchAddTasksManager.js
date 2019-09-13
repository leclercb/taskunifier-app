import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'antd';
import { getDefaultFormItemLayout, getDefaultTailFormItemLayout } from 'utils/FormUtils';
import Icon from 'components/common/Icon';
import TaskTemplateSelect from 'components/tasktemplates/TaskTemplateSelect';
import { useTaskTemplateApi } from 'hooks/UseTaskTemplateApi';
import { useTaskApi } from 'hooks/UseTaskApi';
import { applyTaskTemplate } from 'utils/TaskTemplateUtils';

function BatchAddTasksManager(props) {
    const taskApi = useTaskApi();
    const taskTemplatesApi = useTaskTemplateApi();

    const addTasks = () => {
        props.form.validateFields(async (error, values) => {
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
            }
        });
    };

    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();
    const tailFormItemLayout = getDefaultTailFormItemLayout();

    return (
        <Form {...formItemLayout}>
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
                    <Input.TextArea autosize={{ minRows: 5 }} />
                )}
            </Form.Item>
            <Form.Item label="Task Template">
                {getFieldDecorator('taskTemplate', {
                    initialValue: null
                })(
                    <TaskTemplateSelect />
                )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button onClick={() => addTasks()}>
                    <Icon icon="plus" text="Add tasks" />
                </Button>
            </Form.Item>
        </Form>
    );
}

BatchAddTasksManager.propTypes = {
    form: PropTypes.object.isRequired,
    onAdd: PropTypes.func.isRequired
};

export default Form.create({ name: 'batchAddTasks' })(BatchAddTasksManager);