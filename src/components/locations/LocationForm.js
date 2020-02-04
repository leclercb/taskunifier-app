import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { getLocationFields } from 'data/DataLocationFields';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { LocationPropType } from 'proptypes/LocationPropTypes';
import { getDefaultFormItemLayout, onCommitForm } from 'utils/FormUtils';

function LocationForm({ location, updateLocation }) {
    const settingsApi = useSettingsApi();

    const [form] = Form.useForm();

    const fields = getLocationFields(settingsApi.settings);

    const formItemLayout = getDefaultFormItemLayout();

    const titleRef = useRef(null);

    useEffect(() => {
        if (titleRef.current && !location.title) {
            titleRef.current.focus();
        }
    }, [location.id]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Form form={form} initialValues={location} {...formItemLayout}>
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
                            onCommit: () => onCommitForm(form, location, updateLocation)
                        })}
                </Form.Item>
            ))}
        </Form>
    );
}

LocationForm.propTypes = {
    location: LocationPropType.isRequired,
    updateLocation: PropTypes.func.isRequired
};

export default LocationForm;