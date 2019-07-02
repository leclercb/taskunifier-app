import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { getContactFields } from 'data/DataContactFields';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { ContactPropType } from 'proptypes/ContactPropTypes';
import { getDefaultFormItemLayout, onFieldChangeForObjectUpdates } from 'utils/FormUtils';

function ContactForm(props) {
    const fields = getContactFields();

    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    return (
        <Form {...formItemLayout}>
            {fields.filter(field => field.visible !== false).map(field => (
                <Form.Item key={field.id} label={field.title}>
                    {getFieldDecorator(field.id, {
                        valuePropName: getValuePropNameForType(field.type),
                        initialValue: props.contact[field.id]
                    })(
                        getInputForType(field.type, field.options)
                    )}
                </Form.Item>
            ))}
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