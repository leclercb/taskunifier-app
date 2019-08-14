import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Radio, Select } from 'antd';
import { onCommitForm } from 'utils/FormUtils';
import { getDaysOfWeek } from 'utils/RepeatUtils';
import { RepeatPropType } from 'proptypes/RepeatPropTypes';

function RepeatDailyForm(props) {
    const { getFieldDecorator } = props.form;

    const radioStyle = {
        display: 'block',
        height: '50px',
        lineHeight: '50px'
    };

    const onCommit = () => onCommitForm(props.form, props.repeat, props.updateRepeat, { force: true });

    return (
        <Form>
            {getFieldDecorator('type', {
                initialValue: props.repeat ? props.repeat.type : undefined
            })(
                <Radio.Group onChange={onCommit}>
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
                            initialValue: props.repeat ? props.repeat.nbDays : undefined,
                            rules: [
                                {
                                    required: true,
                                    message: 'The number of days is required'
                                }
                            ]
                        })(
                            <InputNumber
                                onBlur={onCommit}
                                min={1}
                                disabled={props.repeat.type !== 'everyXDays'} />
                        )}
                        <span style={{ marginLeft: 10 }}>day(s)</span>
                    </Radio>
                    <Radio style={radioStyle} value='everySelectedDay'>
                        <span style={{ marginRight: 10 }}>Every</span>
                        {getFieldDecorator('dayOfWeek', {
                            initialValue: props.repeat ? props.repeat.dayOfWeek : undefined,
                            rules: [
                                {
                                    required: true,
                                    message: 'The day of week is required'
                                }
                            ]
                        })(
                            <Select
                                onBlur={onCommit}
                                style={{ width: 100 }}
                                disabled={props.repeat.type !== 'everySelectedDay'}>
                                {getDaysOfWeek().map(item => (
                                    <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                                ))}
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
    repeat: RepeatPropType,
    updateRepeat: PropTypes.func.isRequired
};

export default Form.create({ name: 'repeat' })(RepeatDailyForm);