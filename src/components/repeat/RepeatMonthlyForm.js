import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Radio, Select } from 'antd';
import { onFieldChangeForObjectUpdates } from 'utils/FormUtils';

function RepeatMonthlyForm(props) {
    const { getFieldDecorator } = props.form;

    const radioStyle = {
        display: 'block',
        height: '50px',
        lineHeight: '50px',
    };

    return (
        <Form>
            {getFieldDecorator('type', {
                initialValue: props.repeat ? props.repeat.type : null
            })(
                <Radio.Group>
                    <Radio style={radioStyle} value='everyXMonths'>
                        <span style={{ marginRight: 10 }}>Every</span>
                        {getFieldDecorator('nbMonths', {
                            initialValue: props.repeat ? props.repeat.nbMonths : null,
                            rules: [
                                {
                                    required: true,
                                    message: 'The number of months is required',
                                }
                            ]
                        })(
                            <InputNumber min={0} disabled={props.repeat.type !== 'everyXMonths'} />
                        )}
                        <span style={{ marginLeft: 10 }}>month(s)</span>
                    </Radio>
                    <Radio style={radioStyle} value='dayXEveryYMonths'>
                        <span style={{ marginRight: 10 }}>Day</span>
                        {getFieldDecorator('dayNb', {
                            initialValue: props.repeat ? props.repeat.dayNb : null,
                            rules: [
                                {
                                    required: true,
                                    message: 'The day number is required',
                                }
                            ]
                        })(
                            <InputNumber min={0} disabled={props.repeat.type !== 'dayXEveryYMonths'} />
                        )}
                        <span style={{ margin: '0px 10px' }}>of every</span>
                        {getFieldDecorator('nbMonths', {
                            initialValue: props.repeat ? props.repeat.nbMonths : null,
                            rules: [
                                {
                                    required: true,
                                    message: 'The number of months is required',
                                }
                            ]
                        })(
                            <InputNumber min={0} disabled={props.repeat.type !== 'dayXEveryYMonths'} />
                        )}
                        <span style={{ marginLeft: 10 }}>month(s)</span>
                    </Radio>
                    <Radio style={radioStyle} value='weekXDayYEveryZMonths'>
                        <span style={{ marginRight: 10 }}>Every</span>
                        {getFieldDecorator('weekNb', {
                            initialValue: props.repeat ? props.repeat.weekNb : null,
                            rules: [
                                {
                                    required: true,
                                    message: 'The week number is required',
                                }
                            ]
                        })(
                            <Select style={{ width: 100 }} disabled={props.repeat.type !== 'weekXDayYEveryZMonths'}>
                                <Select.Option value="first">First</Select.Option>
                                <Select.Option value="second">Second</Select.Option>
                                <Select.Option value="third">Third</Select.Option>
                                <Select.Option value="fourth">Fourth</Select.Option>
                                <Select.Option value="last">Last</Select.Option>
                            </Select>
                        )}
                        <span style={{ marginRight: 10 }}>&nbsp;</span>
                        {getFieldDecorator('dayOfWeek', {
                            initialValue: props.repeat ? props.repeat.dayOfWeek : null,
                            rules: [
                                {
                                    required: true,
                                    message: 'The day of week is required',
                                }
                            ]
                        })(
                            <Select style={{ width: 100 }} disabled={props.repeat.type !== 'weekXDayYEveryZMonths'}>
                                <Select.Option value="monday">Monday</Select.Option>
                                <Select.Option value="tuesday">Tuesday</Select.Option>
                                <Select.Option value="wednesday">Wednesday</Select.Option>
                                <Select.Option value="thursday">Thursday</Select.Option>
                                <Select.Option value="friday">Friday</Select.Option>
                                <Select.Option value="saturday">Saturday</Select.Option>
                                <Select.Option value="sunday">Sunday</Select.Option>
                            </Select>
                        )}
                        <span style={{ margin: '0px 10px' }}>of every</span>
                        {getFieldDecorator('nbMonths', {
                            initialValue: props.repeat ? props.repeat.nbMonths : null,
                            rules: [
                                {
                                    required: true,
                                    message: 'The number of months is required',
                                }
                            ]
                        })(
                            <InputNumber min={0} disabled={props.repeat.type !== 'weekXDayYEveryZMonths'} />
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
    repeat: PropTypes.object,
    onUpdateRepeat: PropTypes.func.isRequired
};

export default Form.create({
    name: 'repeat',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.repeat, props.onUpdateRepeat)
})(RepeatMonthlyForm);