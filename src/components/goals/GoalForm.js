import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Checkbox } from 'antd';
import ColorPicker from 'rc-color-picker';
import { GoalPropType } from '../../proptypes/GoalPropTypes';
import { getDefaultFormItemLayout, getDefaultTailFormItemLayout, onFieldChangeForObjectUpdates } from '../../utils/FormUtils';

function GoalForm(props) {
    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();
    const tailFormItemLayout = getDefaultTailFormItemLayout();

    return (
        <Form {...formItemLayout}>
            <Form.Item label="Title">
                {getFieldDecorator('title', {
                    initialValue: props.goal.title,
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
                    initialValue: props.goal.color,
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
            <Form.Item {...tailFormItemLayout}>
                {getFieldDecorator('archived', {
                    initialValue: props.goal.archived,
                    valuePropName: 'checked'
                })(
                    <Checkbox>Archived</Checkbox>
                )}
            </Form.Item>
        </Form>
    );
}

GoalForm.propTypes = {
    goal: GoalPropType.isRequired,
    updateGoal: PropTypes.func.isRequired
};

export default Form.create({
    name: 'goal',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.goal, props.updateGoal)
})(GoalForm);