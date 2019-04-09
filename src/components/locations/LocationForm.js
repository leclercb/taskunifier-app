import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import { LocationPropType } from '../../proptypes/LocationPropTypes';
import { merge } from '../../utils/ObjectUtils';

function LocationForm(props) {
    const onSave = (e) => {
        e.preventDefault();
        props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const updatedLocation = merge({ ...props.location }, values);
                props.updateLocation(updatedLocation);
            }
        });
    }

    const { getFieldDecorator } = props.form;

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 8,
            },
        },
    };

    return (
        <Form {...formItemLayout} onSubmit={onSave}>
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
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">Save</Button>
            </Form.Item>
        </Form>
    );
}

LocationForm.propTypes = {
    location: LocationPropType.isRequired,
    updateLocation: PropTypes.func.isRequired
}

export default Form.create({ name: 'location' })(LocationForm);