import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'antd';
import { getDefaultFormItemLayout, getDefaultTailFormItemLayout } from '../../utils/FormUtils';
import Icon from '../common/Icon';
import { TaskTemplateSelect } from '../tasktemplates/TaskTemplateSelect';
import { TaskTemplatePropType } from '../../proptypes/TaskTemplatePropTypes';
import withTasks from '../../containers/WithTasks';
import withTaskTemplates from '../../containers/WithTaskTemplates';
import { applyTaskTemplate } from '../../utils/TaskTemplateUtils';

function BatchAddTasks(props) {
    const addTasks = () => {
        props.form.validateFields((error, values) => {
            if (error) {
                return;
            }

            if (values.titles) {
                const taskTemplate = props.taskTemplates.find(taskTemplate => taskTemplate.id === values.taskTemplate);
                const tokens = values.titles.split('\n');

                tokens.forEach(token => {
                    if (token) {
                        const task = {};
                        applyTaskTemplate(taskTemplate, task);
                        task.title = token;
                        props.addTask(task);
                    }
                });

                props.onAdd();
            }
        });
    }

    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();
    const tailFormItemLayout = getDefaultTailFormItemLayout();

    return (
        <Form {...formItemLayout}>
            <Form.Item label="Titles">
                {getFieldDecorator('titles', {
                    initialValue: null,
                    rules: [
                        {
                            required: true,
                            message: 'The titles are required',
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

BatchAddTasks.propTypes = {
    taskTemplates: PropTypes.arrayOf(TaskTemplatePropType).isRequired,
    addTask: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired
};

export default withTasks(withTaskTemplates(Form.create({ name: 'batch' })(BatchAddTasks)), { actionsOnly: true });