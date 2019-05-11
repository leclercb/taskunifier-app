import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Form, Input } from 'antd';
import ColorPicker from 'components/common/ColorPicker';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { TaskTemplatePropType } from 'proptypes/TaskTemplatePropTypes';
import { getDefaultFormItemLayout, onFieldChangeForObjectUpdates } from 'utils/FormUtils';
import withTaskFields from 'containers/WithTaskFields';
import {
    getInputForType,
    getNormalizeForType,
    getValueFromEventForType,
    getValuePropNameForType
} from 'utils/FieldUtils';

function TaskTemplateForm(props) {
    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

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
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="Color">
                {getFieldDecorator('color', {
                    initialValue: props.taskTemplate.color,
                    valuePropName: 'color',
                    getValueFromEvent: event => event.color,
                    rules: [
                        {
                            required: true,
                            message: 'The color is required'
                        }
                    ]
                })(
                    <ColorPicker />
                )}
            </Form.Item>
            <Divider>Task Properties</Divider>
            {props.taskFields.map(field => (
                <Form.Item key={field.id} label={field.title}>
                    {getFieldDecorator('properties.' + field.id, {
                        rules: [],
                        normalize: getNormalizeForType(field.type),
                        valuePropName: getValuePropNameForType(field.type),
                        getValueFromEvent: getValueFromEventForType(field.type),
                        initialValue: getNormalizeForType(field.type)(props.taskTemplate.properties ? props.taskTemplate.properties[field.id] : null)
                    })(
                        getInputForType(field.type, field.options)
                    )}
                </Form.Item>
            ))}
        </Form>
    );
}

TaskTemplateForm.propTypes = {
    form: PropTypes.object.isRequired,
    taskFields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired,
    taskTemplate: TaskTemplatePropType.isRequired,
    updateTaskTemplate: PropTypes.func.isRequired
};

export default withTaskFields(Form.create({
    name: 'taskTemplate',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.taskTemplate, props.updateTaskTemplate)
})(TaskTemplateForm));