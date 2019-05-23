import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Empty, Form, Input, Select } from 'antd';
import { getInputForType } from 'data/DataFieldComponents';
import { getFieldType, getFieldTypes, getValuePropNameForType } from 'data/DataFieldTypes';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { getDefaultFormItemLayout, onFieldChangeForObjectUpdates } from 'utils/FormUtils';

function TaskFieldForm(props) {
    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    const config = getFieldType(props.taskField.type, props.taskField.options);

    return (
        <Form {...formItemLayout}>
            <Form.Item label="Title">
                {getFieldDecorator('title', {
                    initialValue: props.taskField.title,
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
            <Form.Item label="Type">
                {getFieldDecorator('type', {
                    initialValue: props.taskField.type,
                    rules: [
                        {
                            required: true,
                            message: 'The type is required'
                        }
                    ]
                })(
                    <Select>
                        {getFieldTypes().filter(type => getFieldType(type).allowCreation).map(type => {
                            return (
                                <Select.Option key={type} value={type}>
                                    {getFieldType(type).title}
                                </Select.Option>
                            );
                        })}
                    </Select>
                )}
            </Form.Item>
            <Divider>Task Field Options</Divider>
            {config.options.length === 0 && (
                <Empty description="There is no option for this field type" />
            )}
            {config.options.map(option => (
                <Form.Item key={option.id} label={option.title}>
                    {getFieldDecorator('options.' + option.id, {
                        valuePropName: getValuePropNameForType(option.type),
                        initialValue: props.taskField.options ? props.taskField.options[option.id] : undefined
                    })(
                        getInputForType(option.type, option.options)
                    )}
                </Form.Item>
            ))}
        </Form>
    );
}

TaskFieldForm.propTypes = {
    form: PropTypes.object.isRequired,
    taskField: FieldPropType.isRequired,
    updateTaskField: PropTypes.func.isRequired
};

export default Form.create({
    name: 'taskField',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.taskField, props.updateTaskField)
})(TaskFieldForm);