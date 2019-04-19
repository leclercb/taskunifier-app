import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Checkbox, Select } from 'antd';
import ColorPicker from '../common/ColorPicker';
import { GoalPropType } from '../../proptypes/GoalPropTypes';
import { getDefaultFormItemLayout, getDefaultTailFormItemLayout, onFieldChangeForObjectUpdates } from '../../utils/FormUtils';
import { getGoalLevels } from '../../data/DataGoalLevels';
import GoalSelect from './GoalSelect';
import Icon from '../common/Icon';

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
            <Form.Item label="Level">
                {getFieldDecorator('level', {
                    initialValue: props.goal.level,
                    rules: [
                        {
                            required: true,
                            message: 'The level is required',
                        }
                    ]
                })(
                    <Select>
                        {getGoalLevels().map(level => (
                            <Select.Option key={level.id} value={level.id}>
                                <Icon icon="circle" color={level.color} text={level.title} />
                            </Select.Option>
                        ))}
                    </Select>
                )}
            </Form.Item>
            <Form.Item label="Contributes To">
                {getFieldDecorator('contributesTo', {
                    initialValue: props.goal.contributesTo,
                    rules: []
                })(
                    <GoalSelect excludeIds={[props.goal.id]} disabled={props.goal.level === 'life_time'} />
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