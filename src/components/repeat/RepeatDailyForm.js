import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Radio, Select } from 'antd';
import { onFieldChangeForObjectUpdates } from 'utils/FormUtils';

function RepeatDailyForm(props) {
    const { getFieldDecorator } = props.form;

    const radioStyle = {
        display: 'block',
        height: '50px',
        lineHeight: '50px',
    };
console.log(props.repeat);
    return (
        <Form>
            {getFieldDecorator('type', {
                initialValue: props.repeat ? props.repeat.type : null
            })(
                <Radio.Group>
                    <Radio style={radioStyle} value='everyDay'>
                        Every day
                    </Radio>
                    <Radio style={radioStyle} value='everyWeekday'>
                        Every weekday
                    </Radio>
                    <Radio style={radioStyle} value='everyWeekend'>
                        Every weekend
                    </Radio>
                    <Radio style={radioStyle} value='everyXDays'>
                        <span style={{ marginRight: 10 }}>Every</span>
                        {getFieldDecorator('nbDays', {
                            initialValue: props.repeat ? props.repeat.nbDays : null,
                            rules: [
                                {
                                    required: true,
                                    message: 'The number of days is required',
                                }
                            ]
                        })(
                            <InputNumber min={0} />
                        )}
                        <span style={{ marginLeft: 10 }}>day(s)</span>
                    </Radio>
                    <Radio style={radioStyle} value='everySelectedDay'>
                        <span style={{ marginRight: 10 }}>Every</span>
                        {getFieldDecorator('selectedDays', {
                            initialValue: props.repeat ? props.repeat.selectedDays : null,
                            rules: [
                                {
                                    required: true,
                                    message: 'The day is required',
                                }
                            ]
                        })(
                            <Select style={{ width: 100 }}>
                                <Select.Option value="monday">Monday</Select.Option>
                                <Select.Option value="tuesday">Tuesday</Select.Option>
                                <Select.Option value="wednesday">Wednesday</Select.Option>
                                <Select.Option value="thursday">Thursday</Select.Option>
                                <Select.Option value="friday">Friday</Select.Option>
                                <Select.Option value="saturday">Saturday</Select.Option>
                                <Select.Option value="sunday">Sunday</Select.Option>
                            </Select>
                        )}
                    </Radio>
                </Radio.Group>
            )}
        </Form>
    );
}

RepeatDailyForm.propTypes = {
    form: PropTypes.object.isRequired,
    repeat: PropTypes.object,
    onUpdateRepeat: PropTypes.func.isRequired
};

export default Form.create({
    name: 'repeat',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.repeat, props.onUpdateRepeat)
})(RepeatDailyForm);