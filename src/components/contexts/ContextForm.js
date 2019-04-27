import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import ColorPicker from 'components/common/ColorPicker';
import { ContextPropType } from 'proptypes/ContextPropTypes';
import { getDefaultFormItemLayout, onFieldChangeForObjectUpdates } from 'utils/FormUtils';

function ContextForm(props) {
    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    return (
        <Form {...formItemLayout}>
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
                    valuePropName: 'color',
                    getValueFromEvent: event => event.color,
                    rules: [
                        {
                            required: true, 
                            message: 'The color is required',
                        }
                    ]
                })(
                    <ColorPicker placement="bottomLeft" />
                )}
            </Form.Item>
        </Form>
    );
}

ContextForm.propTypes = {
    form: PropTypes.object.isRequired,
    context: ContextPropType.isRequired,
    updateContext: PropTypes.func.isRequired
};

export default Form.create({
    name: 'context',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.context, props.updateContext)
})(ContextForm);