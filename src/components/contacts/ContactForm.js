import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { getContactFields } from 'data/DataContactFields';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { ContactPropType } from 'proptypes/ContactPropTypes';
import { getDefaultFormItemLayout, onCommitForm } from 'utils/FormUtils';

function ContactForm({ contact, updateContact }) {
    const settingsApi = useSettingsApi();

    const [form] = Form.useForm();

    const fields = getContactFields(settingsApi.settings);

    const formItemLayout = getDefaultFormItemLayout();

    const firstNameRef = useRef(null);

    useEffect(() => {
        form.resetFields();

        if (firstNameRef.current && !contact.firstName) {
            firstNameRef.current.focus();
        }
    }, [contact]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Form form={form} initialValues={contact} {...formItemLayout}>
            {fields.filter(field => field.visible !== false).map(field => (
                <Form.Item
                    key={field.id}
                    name={field.id}
                    label={field.title}
                    valuePropName={getValuePropNameForType(field.type)}>
                    {getInputForType(
                        field.type,
                        field.options,
                        {
                            ref: field.id === 'firstName' ? firstNameRef : undefined,
                            onCommit: () => onCommitForm(form, contact, updateContact)
                        })}
                </Form.Item>
            ))}
        </Form>
    );
}

ContactForm.propTypes = {
    contact: ContactPropType.isRequired,
    updateContact: PropTypes.func.isRequired
};

export default ContactForm;