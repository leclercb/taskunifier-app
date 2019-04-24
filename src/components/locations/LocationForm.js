import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import ColorPicker from 'components/common/ColorPicker';
import { LocationPropType } from 'proptypes/LocationPropTypes';
import { getDefaultFormItemLayout, onFieldChangeForObjectUpdates } from 'utils/FormUtils';

function LocationForm(props) {
    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    return (
        <Form {...formItemLayout}>
            <Form.Item label="Title">
                {getFieldDecorator('title', {
                    initialValue: props.location.title,
                    rules: [
                        {
                            required: true,
                            message: 'The title is required',
                        }
                    ]
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="Color">
                {getFieldDecorator('color', {
                    initialValue: props.location.color,
                    valuePropName: 'color',
                    getValueFromEvent: event => event.color,
                    rules: [
                        {
                            required: true, message: 'The color is required',
                        }
                    ]
                })(
                    <ColorPicker />
                )}
            </Form.Item>
            <Form.Item label="Description">
                {getFieldDecorator('description', {
                    initialValue: props.location.description
                })(
                    <Input.TextArea />
                )}
            </Form.Item>
            <Form.Item label="Latitude">
                {getFieldDecorator('latitude', {
                    initialValue: props.location.latitude
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="Longitude">
                {getFieldDecorator('longitude', {
                    initialValue: props.location.longitude
                })(
                    <Input />
                )}
            </Form.Item>
        </Form>
    );
}

LocationForm.propTypes = {
    location: LocationPropType.isRequired,
    updateLocation: PropTypes.func.isRequired
};

export default Form.create({
    name: 'location',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.location, props.updateLocation)
})(LocationForm);