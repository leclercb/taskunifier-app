import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import ColorPicker from 'components/common/ColorPicker';
import { ContactPropType } from 'proptypes/ContactPropTypes';
import { getDefaultFormItemLayout, onFieldChangeForObjectUpdates } from 'utils/FormUtils';

function ContactForm(props) {
    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    return (
        <Form {...formItemLayout}>
            <Form.Item label="First Name">
                {getFieldDecorator('firstName', {
                    initialValue: props.contact.firstName,
                    rules: [
                        {
                            required: true,
                            message: 'The first name is required'
                        }
                    ]
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="Last Name">
                {getFieldDecorator('lastName', {
                    initialValue: props.contact.lastName,
                    rules: [
                        {
                            required: true,
                            message: 'The last name is required'
                        }
                    ]
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="Email">
                {getFieldDecorator('email', {
                    initialValue: props.contact.email,
                    rules: [
                        {
                            required: true,
                            message: 'The email is required'
                        }
                    ]
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="Color">
                {getFieldDecorator('color', {
                    initialValue: props.contact.color,
                    valuePropName: 'color',
                    getValueFromEvent: event => event.color,
                    rules: [
                        {
                            required: true, 
                            message: 'The color is required'
                        }
                    ]
                })(
                    <ColorPicker placement="bottomLeft" />
                )}
            </Form.Item>
        </Form>
    );
}

ContactForm.propTypes = {
    form: PropTypes.object.isRequired,
    contact: ContactPropType.isRequired,
    updateContact: PropTypes.func.isRequired
};

export default Form.create({
    name: 'contact',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.contact, props.updateContact)
})(ContactForm);