import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Form, Input, InputNumber, Radio, Select } from 'antd';
import { onFieldChangeForObjectUpdates } from 'utils/FormUtils';

function RepeatMonthlyForm(props) {
    const onChange = value => {

    }

    const { getFieldDecorator } = props.form;

    const radioStyle = {
        display: 'block',
        height: '50px',
        lineHeight: '50px',
    };

    return (
        <Form>
            <Radio.Group onChange={onChange} value={null}>
                <Radio style={radioStyle} value='everyxmonths'>
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
                        <InputNumber min={0} />
                    )}
                    <span style={{ marginLeft: 10 }}>month(s)</span>
                </Radio>
                <Radio style={radioStyle} value='dayxeveryxmonths'>
                    <span style={{ marginRight: 10 }}>Day</span>
                    {getFieldDecorator('day', {
                        initialValue: props.repeat ? props.repeat.day : null,
                        rules: [
                            {
                                required: true,
                                message: 'The day is required',
                            }
                        ]
                    })(
                        <InputNumber min={0} />
                    )}
                    <span style={{ margin: '0px 10px' }}>of every</span>
                    {getFieldDecorator('nbMonths2', {
                        initialValue: props.repeat ? props.repeat.nbMonths2 : null,
                        rules: [
                            {
                                required: true,
                                message: 'The number of months is required',
                            }
                        ]
                    })(
                        <InputNumber min={0} />
                    )}
                    <span style={{ marginLeft: 10 }}>month(s)</span>
                </Radio>
                <Radio style={radioStyle} value='dayxeveryxmonths'>
                    <span style={{ marginRight: 10 }}>Every</span>
                    {getFieldDecorator('nb', {
                        initialValue: props.repeat ? props.repeat.nb : null,
                        rules: [
                            {
                                required: true,
                                message: 'The day is required',
                            }
                        ]
                    })(
                        <Select style={{width: 100}}>
                            <Select.Option value="first">First</Select.Option>
                            <Select.Option value="second">Second</Select.Option>
                            <Select.Option value="third">Third</Select.Option>
                            <Select.Option value="fourth">Fourth</Select.Option>
                            <Select.Option value="last">Last</Select.Option>
                        </Select>
                    )}
                    <span style={{ marginRight: 10 }}>&nbsp;</span>
                    {getFieldDecorator('weekday', {
                        initialValue: props.repeat ? props.repeat.weekday : null,
                        rules: [
                            {
                                required: true,
                                message: 'The day is required',
                            }
                        ]
                    })(
                        <Select style={{width: 100}}>
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
                    {getFieldDecorator('nbMonths2', {
                        initialValue: props.repeat ? props.repeat.nbMonths2 : null,
                        rules: [
                            {
                                required: true,
                                message: 'The number of months is required',
                            }
                        ]
                    })(
                        <InputNumber min={0} />
                    )}
                    <span style={{ marginLeft: 10 }}>month(s)</span>
                </Radio>
            </Radio.Group>
        </Form>
    );
}

RepeatMonthlyForm.propTypes = {
    form: PropTypes.object.isRequired,
    repeat: PropTypes.object.isRequired,
    onUpdateRepeat: PropTypes.func.isRequired
};

export default Form.create({
    name: 'repeat',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.repeat, props.onUpdateRepeat)
})(RepeatMonthlyForm);