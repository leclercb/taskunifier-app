import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'antd';
import { getDefaultFormItemLayout, getDefaultTailFormItemLayout } from 'utils/FormUtils';
import Icon from 'components/common/Icon';
import { TaskTemplateSelect } from 'components/tasktemplates/TaskTemplateSelect';
import { TaskTemplatePropType } from 'proptypes/TaskTemplatePropTypes';
import withTasks from 'containers/WithTasks';
import withTaskTemplates from 'containers/WithTaskTemplates';
import { applyTaskTemplate } from 'utils/TaskTemplateUtils';

function BatchAddTasksManager(props) {
    const addTasks = () => {
        props.form.validateFields((error, values) => {
            if (error) {
                return;
            }

            if (values.titles) {
                const taskTemplate = props.taskTemplates.find(taskTemplate => taskTemplate.id === values.taskTemplate);
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
                        promises.push(props.addTask(task));

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

                Promise.all(promises).then(tasks => {
                    const parents = [];

                    tasks.forEach((task, index) => {
                        parents[taskSubLevels[index]] = task.id;

                        if (taskSubLevels[index] === 0) {
                            return;
                        }

                        props.updateTask({
                            ...task,
                            parent: parents[taskSubLevels[index] - 1]
                        });
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
                    <TaskTemplateSelect taskTemplates={props.taskTemplates} />
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
    taskTemplates: PropTypes.arrayOf(TaskTemplatePropType.isRequired).isRequired,
    addTask: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired
};

export default withTasks(withTaskTemplates(Form.create({ name: 'batchAddTasks' })(BatchAddTasksManager)), { includeState: false });