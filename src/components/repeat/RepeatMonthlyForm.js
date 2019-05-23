import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Radio, Select } from 'antd';
import { onFieldChangeForObjectUpdates } from 'utils/FormUtils';
import { getDaysOfWeek, getWeekNumbers } from 'utils/RepeatUtils';
import { RepeatPropType } from 'proptypes/RepeatPropTypes';

function RepeatMonthlyForm(props) {
    const { getFieldDecorator } = props.form;

    const radioStyle = {
        display: 'block',
        height: '50px',
        lineHeight: '50px'
    };

    return (
        <Form>
            {getFieldDecorator('type', {
                initialValue: props.repeat ? props.repeat.type : undefined
            })(
                <Radio.Group>
                    <Radio style={radioStyle} value='everyXMonths'>
                        <span style={{ marginRight: 10 }}>Every</span>
                        {getFieldDecorator('nbMonths', {
                            initialValue: props.repeat ? props.repeat.nbMonths : undefined,
                            rules: [
                                {
                                    required: true,
                                    message: 'The number of months is required'
                                }
                            ]
                        })(
                            <InputNumber min={1} disabled={props.repeat.type !== 'everyXMonths'} />
                        )}
                        <span style={{ marginLeft: 10 }}>month(s)</span>
                    </Radio>
                    <Radio style={radioStyle} value='dayXEveryYMonths'>
                        <span style={{ marginRight: 10 }}>Day</span>
                        {getFieldDecorator('dayNb', {
                            initialValue: props.repeat ? props.repeat.dayNb : undefined,
                            rules: [
                                {
                                    required: true,
                                    message: 'The day number is required'
                                }
                            ]
                        })(
                            <InputNumber min={1} max={31} disabled={props.repeat.type !== 'dayXEveryYMonths'} />
                        )}
                        <span style={{ margin: '0px 10px' }}>of every</span>
                        {getFieldDecorator('nbMonths', {
                            initialValue: props.repeat ? props.repeat.nbMonths : undefined,
                            rules: [
                                {
                                    required: true,
                                    message: 'The number of months is required'
                                }
                            ]
                        })(
                            <InputNumber min={1} disabled={props.repeat.type !== 'dayXEveryYMonths'} />
                        )}
                        <span style={{ marginLeft: 10 }}>month(s)</span>
                    </Radio>
                    <Radio style={radioStyle} value='weekXDayYEveryZMonths'>
                        <span style={{ marginRight: 10 }}>Every</span>
                        {getFieldDecorator('weekNb', {
                            initialValue: props.repeat ? props.repeat.weekNb : undefined,
                            rules: [
                                {
                                    required: true,
                                    message: 'The week number is required'
                                }
                            ]
                        })(
                            <Select style={{ width: 100 }} disabled={props.repeat.type !== 'weekXDayYEveryZMonths'}>
                                {getWeekNumbers().map(item => (
                                    <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        )}
                        <span style={{ marginRight: 10 }}>&nbsp;</span>
                        {getFieldDecorator('dayOfWeek', {
                            initialValue: props.repeat ? props.repeat.dayOfWeek : undefined,
                            rules: [
                                {
                                    required: true,
                                    message: 'The day of week is required'
                                }
                            ]
                        })(
                            <Select style={{ width: 100 }} disabled={props.repeat.type !== 'weekXDayYEveryZMonths'}>
                                {getDaysOfWeek().map(item => (
                                    <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        )}
                        <span style={{ margin: '0px 10px' }}>of every</span>
                        {getFieldDecorator('nbMonths', {
                            initialValue: props.repeat ? props.repeat.nbMonths : undefined,
                            rules: [
                                {
                                    required: true,
                                    message: 'The number of months is required'
                                }
                            ]
                        })(
                            <InputNumber min={1} disabled={props.repeat.type !== 'weekXDayYEveryZMonths'} />
                        )}
                        <span style={{ marginLeft: 10 }}>month(s)</span>
                    </Radio>
                </Radio.Group>
            )}
        </Form>
    );
}

RepeatMonthlyForm.propTypes = {
    form: PropTypes.object.isRequired,
    repeat: RepeatPropType,
    updateRepeat: PropTypes.func.isRequired
};

export default Form.create({
    name: 'repeat',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.repeat, props.updateRepeat)
})(RepeatMonthlyForm);