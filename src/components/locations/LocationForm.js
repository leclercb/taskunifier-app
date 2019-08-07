import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { getLocationFields } from 'data/DataLocationFields';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { LocationPropType } from 'proptypes/LocationPropTypes';
import { getDefaultFormItemLayout, onCommitForm } from 'utils/FormUtils';

function LocationForm(props) {
    const fields = getLocationFields();

    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    return (
        <Form {...formItemLayout}>
            {fields.filter(field => field.visible !== false).map(field => (
                <Form.Item key={field.id} label={field.title}>
                    {getFieldDecorator(field.id, {
                        valuePropName: getValuePropNameForType(field.type),
                        initialValue: props.location[field.id]
                    })(
                        getInputForType(
                            field.type,
                            field.options,
                            {
                                onCommit: () => onCommitForm(props.form, props.location, props.updateLocation)
                            })
                    )}
                </Form.Item>
            ))}
        </Form>
    );
}

LocationForm.propTypes = {
    form: PropTypes.object.isRequired,
    location: LocationPropType.isRequired,
    updateLocation: PropTypes.func.isRequired
};

export default Form.create({ name: 'location' })(LocationForm);