import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Divider, Empty, Form, Input, Select } from 'antd';
import ColorPicker from 'components/common/ColorPicker';
import { getInputForType } from 'data/DataFieldComponents';
import { getFieldType, getFieldTypes, getValuePropNameForType } from 'data/DataFieldTypes';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { getDefaultFormItemLayout, onCommitForm } from 'utils/FormUtils';

function FieldForm({ objects, field, updateField }) {
    const [form] = Form.useForm();

    const formItemLayout = getDefaultFormItemLayout();

    const titleRef = useRef(null);

    useEffect(() => {
        form.resetFields();

        if (titleRef.current && !field.title) {
            titleRef.current.focus();
        }
    }, [field.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const config = getFieldType(field.type, field.options);

    const onCommit = () => onCommitForm(form, field, updateField);

    const isTypeDisabled = !!objects.find(object => field.id in object);

    return (
        <Form form={form} initialValues={field} {...formItemLayout}>
            <Form.Item
                name="title"
                label="Title"
                rules={[
                    {
                        required: true,
                        message: 'The title is required'
                    }
                ]}>
                <Input ref={titleRef} onBlur={onCommit} />
            </Form.Item>
            <Form.Item
                name="color"
                label="Color"
                valuePropName="color"
                rules={[
                    {
                        required: true,
                        message: 'The color is required'
                    }
                ]}>
                <ColorPicker onClose={onCommit} />
            </Form.Item>
            <Form.Item
                name="type"
                label="Type"
                rules={[
                    {
                        required: true,
                        message: 'The type is required'
                    }
                ]}>
                <Select onBlur={onCommit} disabled={isTypeDisabled}>
                    {getFieldTypes().filter(type => getFieldType(type).allowCreation).map(type => {
                        return (
                            <Select.Option key={type} value={type}>
                                {getFieldType(type).title}
                            </Select.Option>
                        );
                    })}
                </Select>
            </Form.Item>
            <Divider>Field Options</Divider>
            {config.options.length === 0 && (
                <Empty description="There is no option for this field type" />
            )}
            {config.options.map(option => (
                <Form.Item
                    key={option.id}
                    name={['options', option.id]}
                    label={option.title}
                    valuePropName={getValuePropNameForType(option.type)}>
                    {getInputForType(option.type, option.options, { onCommit })}
                </Form.Item>
            ))}
        </Form>
    );
}

FieldForm.propTypes = {
    objects: PropTypes.array.isRequired,
    field: FieldPropType.isRequired,
    updateField: PropTypes.func.isRequired
};

export default FieldForm;