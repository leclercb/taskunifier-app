import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Empty, Form, Input, Select } from 'antd';
import ColorPicker from 'components/common/ColorPicker';
import { getInputForType } from 'data/DataFieldComponents';
import { getFieldType, getFieldTypes, getValuePropNameForType } from 'data/DataFieldTypes';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { getDefaultFormItemLayout, onCommitForm } from 'utils/FormUtils';

function FieldForm(props) {
    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    const config = getFieldType(props.field.type, props.field.options);

    const onCommit = () => onCommitForm(props.form, props.field, props.updateField);

    const isTypeDisabled = !!props.objects.find(object => props.field.id in object);

    return (
        <Form {...formItemLayout}>
            <Form.Item label="Title">
                {getFieldDecorator('title', {
                    initialValue: props.field.title,
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
                    initialValue: props.field.color,
                    valuePropName: 'color',
                    rules: [
                        {
                            required: true,
                            message: 'The color is required'
                        }
                    ]
                })(
                    <ColorPicker onClose={onCommit} placement="bottomLeft" />
                )}
            </Form.Item>
            <Form.Item label="Type">
                {getFieldDecorator('type', {
                    initialValue: props.field.type,
                    rules: [
                        {
                            required: true,
                            message: 'The type is required'
                        }
                    ]
                })(
                    <Select onBlur={onCommit} disabled={isTypeDisabled}>
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
            <Divider>Field Options</Divider>
            {config.options.length === 0 && (
                <Empty description="There is no option for this field type" />
            )}
            {config.options.map(option => (
                <Form.Item key={option.id} label={option.title}>
                    {getFieldDecorator('options.' + option.id, {
                        valuePropName: getValuePropNameForType(option.type),
                        initialValue: props.field.options ? props.field.options[option.id] : undefined
                    })(
                        getInputForType(option.type, option.options, { onCommit })
                    )}
                </Form.Item>
            ))}
        </Form>
    );
}

FieldForm.propTypes = {
    form: PropTypes.object.isRequired,
    objects: PropTypes.array.isRequired,
    field: FieldPropType.isRequired,
    updateField: PropTypes.func.isRequired
};

export default Form.create({ name: 'field' })(FieldForm);