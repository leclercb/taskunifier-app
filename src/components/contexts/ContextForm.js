import React from 'react';
import { Form, Input, Button } from 'antd';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import { ContextPropType } from '../../proptypes/ContextPropTypes';

function ContextForm(props) {
    const handleSubmit = (e) => {
        e.preventDefault();
        props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
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
        <Form {...formItemLayout} onSubmit={handleSubmit}>
            <Form.Item label="Title">
                {getFieldDecorator('title', {
                    initialValue: props.context.title,
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
                    initialValue: props.context.color,
                    rules: [
                        {
                            required: true, message: 'The color is required',
                        }
                    ]
                })(
                    <ColorPicker />
                )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">Save</Button>
            </Form.Item>
        </Form>
    );
}

ContextForm.propTypes = {
    context: ContextPropType.isRequired
}

export default Form.create({ name: 'context' })(ContextForm);