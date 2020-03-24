import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { getContextFields } from 'data/DataContextFields';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { ContextPropType } from 'proptypes/ContextPropTypes';
import { getDefaultFormItemLayout, onCommitForm } from 'utils/FormUtils';

function ContextForm({ context, updateContext }) {
    const settingsApi = useSettingsApi();

    const [form] = Form.useForm();

    const fields = getContextFields(settingsApi.settings);

    const formItemLayout = getDefaultFormItemLayout();

    const titleRef = useRef(null);

    useEffect(() => {
        form.resetFields();

        if (titleRef.current && !context.title) {
            titleRef.current.focus();
        }
    }, [context]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Form form={form} initialValues={context} {...formItemLayout}>
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
                            ref: field.id === 'title' ? titleRef : undefined,
                            onCommit: () => onCommitForm(form, context, updateContext)
                        })}
                </Form.Item>
            ))}
        </Form>
    );
}

ContextForm.propTypes = {
    context: ContextPropType.isRequired,
    updateContext: PropTypes.func.isRequired
};

export default ContextForm;