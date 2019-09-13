import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Form, Input } from 'antd';
import ColorPicker from 'components/common/ColorPicker';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { TaskTemplatePropType } from 'proptypes/TaskTemplatePropTypes';
import { getDefaultFormItemLayout, onCommitForm } from 'utils/FormUtils';

function TaskTemplateForm(props) {
    const settingsApi = useSettingsApi();
    const taskFieldApi = useTaskFieldApi();

    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    const fields = taskFieldApi.taskFields.filter(field => field.editable && settingsApi.settings['taskFieldVisible_' + field.id] !== false);

    const onCommit = () => onCommitForm(props.form, props.taskTemplate, props.updateTaskTemplate);

    return (
        <Form {...formItemLayout}>
            <Form.Item label="Title">
                {getFieldDecorator('title', {
                    initialValue: props.taskTemplate.title,
                    rules: [
                        {
                            required: true,
                            message: 'The title is required'
                        }
                    ]
                })(
                    <Input onBlur={onCommit} />
                )}
            </Form.Item>
            <Form.Item label="Color">
                {getFieldDecorator('color', {
                    initialValue: props.taskTemplate.color,
                    valuePropName: 'color',
                    rules: [
                        {
                            required: true,
                            message: 'The color is required'
                        }
                    ]
                })(
                    <ColorPicker onClose={onCommit} />
                )}
            </Form.Item>
            <Divider>Task Properties</Divider>
            {fields.map(field => (
                <Form.Item key={field.id} label={field.title}>
                    {getFieldDecorator('properties.' + field.id, {
                        valuePropName: getValuePropNameForType(field.type),
                        initialValue: props.taskTemplate.properties ? props.taskTemplate.properties[field.id] : undefined
                    })(
                        getInputForType(field.type, field.options, { onCommit })
                    )}
                </Form.Item>
            ))}
        </Form>
    );
}

TaskTemplateForm.propTypes = {
    form: PropTypes.object.isRequired,
    taskTemplate: TaskTemplatePropType.isRequired,
    updateTaskTemplate: PropTypes.func.isRequired
};

export default Form.create({ name: 'taskTemplate' })(TaskTemplateForm);