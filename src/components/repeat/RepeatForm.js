import React from 'react';
import { Checkbox, DatePicker, Form, InputNumber, Radio, Select } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import RRule from 'rrule';
import { RepeatPropType } from 'proptypes/RepeatPropTypes';
import { getDefaultFormItemLayout } from 'utils/FormUtils';
import { toStringRepeat } from 'utils/StringUtils';

function RepeatForm(props) {
    const { getFieldDecorator } = props.form;

    const onCommit = () => setTimeout(() => {
        props.form.validateFields((error, values) => {
            if (error) {
                return;
            }

            if (Number.parseInt(values.freq) === 999) {
                props.updateRepeat('PARENT');
                return;
            }

            const newRule = new RRule({
                dtstart: values.dtstart.toDate(),
                freq: Number.parseInt(values.freq),
                interval: values.interval,
                byweekday: values.byweekday ? values.byweekday.map(v => Number.parseInt(v)) : [],
                bymonthday: values.bymonthday ? values.bymonthday.map(v => Number.parseInt(v)) : [],
                bymonth: values.bymonth ? values.bymonth.map(v => Number.parseInt(v)) : [],
                byyearday: values.byyearday ? values.byyearday.map(v => Number.parseInt(v)) : [],
                byweekno: values.byweekno ? values.byweekno.map(v => Number.parseInt(v)) : [],
                until: values.end === 'UNTIL' ? (values.endDate ? values.endDate.toDate() : moment()) : undefined
            });

            let newRuleStr = newRule.toString();

            if (values.from === 'completionDate') {
                newRuleStr += ';FROMCOMP';
            } else if (values.fastForward) {
                newRuleStr += ';FASTFORWARD';
            }

            props.updateRepeat(newRuleStr);
        });
    });

    const getUnitFromFreq = freq => {
        switch (freq) {
            case RRule.DAILY: return 'day';
            case RRule.WEEKLY: return 'week';
            case RRule.MONTHLY: return 'month';
            case RRule.YEARLY: return 'year';
            default: return '';
        }
    };

    let rule = new RRule({
        freq: RRule.DAILY,
        interval: 1
    });

    let fromCompletionDate = false;
    let fastForward = false;

    try {
        if (props.repeat && typeof props.repeat === 'string') {
            if (props.repeat === 'PARENT') {
                rule.options.freq = 999;
            } else {
                rule = RRule.fromString(props.repeat.replace(';FROMCOMP', '').replace(';FASTFORWARD', ''));
                fromCompletionDate = props.repeat.includes(';FROMCOMP');
                fastForward = props.repeat.includes(';FASTFORWARD');
            }
        }
    } catch (error) {
        // Use default rule
    }

    return (
        <Form {...getDefaultFormItemLayout()}>
            <Form.Item label={(<strong>Start</strong>)}>
                {getFieldDecorator('dtstart', {
                    initialValue: rule.options.dtstart ? moment(rule.options.dtstart) : undefined
                })(
                    <DatePicker onChange={onCommit} disabled={rule.options.freq === 999} />
                )}
            </Form.Item>
            <Form.Item label={(<strong>Repeat</strong>)}>
                {getFieldDecorator('freq', {
                    initialValue: String(rule.options.freq ? rule.options.freq : RRule.DAILY)
                })(
                    <Select
                        onBlur={onCommit}
                        style={{ width: 200 }}>
                        <Select.Option value={String(RRule.DAILY)}>Daily</Select.Option>
                        <Select.Option value={String(RRule.WEEKLY)}>Weekly</Select.Option>
                        <Select.Option value={String(RRule.MONTHLY)}>Monthly</Select.Option>
                        <Select.Option value={String(RRule.YEARLY)}>Yearly</Select.Option>
                        <Select.Option value="999">With Parent</Select.Option>
                    </Select>
                )}
            </Form.Item>
            {rule.options.freq !== 999 && (
                <Form.Item label="Repeat from">
                    {getFieldDecorator('from', {
                        initialValue: fromCompletionDate ? 'completionDate' : 'dueDate',
                        rules: [
                            {
                                required: true,
                                message: 'This field is required'
                            }
                        ]
                    })(
                        <Radio.Group onChange={onCommit}>
                            <Radio value="completionDate">Completion date</Radio>
                            <Radio value="dueDate">Due date</Radio>
                        </Radio.Group>
                    )}
                    {!fromCompletionDate && (
                        getFieldDecorator('fastForward', {
                            initialValue: fastForward
                        })(
                            <Checkbox onChange={onCommit}>Fast forward</Checkbox>
                        )
                    )}
                </Form.Item>
            )}
            {rule.options.freq !== 999 && (
                <Form.Item label="Every">
                    {getFieldDecorator('interval', {
                        initialValue: rule.options.interval ? rule.options.interval : 1,
                        rules: [
                            {
                                required: true,
                                message: 'The interval is required'
                            }
                        ]
                    })(
                        <InputNumber
                            onBlur={onCommit}
                            min={1} />
                    )}
                    <span style={{ marginLeft: 10 }}>{getUnitFromFreq(rule.options.freq)}(s)</span>
                </Form.Item>
            )}
            {[RRule.DAILY, RRule.WEEKLY, RRule.MONTHLY, RRule.YEARLY].includes(rule.options.freq) && (
                <Form.Item label="On the week day(s)">
                    {getFieldDecorator('byweekday', {
                        initialValue: rule.options.byweekday ? rule.options.byweekday.map(v => String(v)) : []
                    })(
                        <Select
                            mode="multiple"
                            onChange={onCommit}>
                            <Select.Option value="0">Monday</Select.Option>
                            <Select.Option value="1">Tuesday</Select.Option>
                            <Select.Option value="2">Wednesday</Select.Option>
                            <Select.Option value="3">Thursday</Select.Option>
                            <Select.Option value="4">Friday</Select.Option>
                            <Select.Option value="5">Saturday</Select.Option>
                            <Select.Option value="6">Sunday</Select.Option>
                        </Select>
                    )}
                </Form.Item>
            )}
            {[RRule.DAILY, RRule.WEEKLY, RRule.MONTHLY, RRule.YEARLY].includes(rule.options.freq) && (
                <Form.Item label="On the day(s) of the month">
                    {getFieldDecorator('bymonthday', {
                        initialValue: rule.options.bymonthday ? rule.options.bymonthday.map(v => String(v)) : []
                    })(
                        <Select
                            mode="multiple"
                            onChange={onCommit}>
                            {Array.from(Array(31), (_, i) => (
                                <Select.Option key={String(i + 1)} value={String(i + 1)}>{i + 1}</Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
            )}
            {[RRule.DAILY, RRule.WEEKLY, RRule.MONTHLY, RRule.YEARLY].includes(rule.options.freq) && (
                <Form.Item label="On the month(s)">
                    {getFieldDecorator('bymonth', {
                        initialValue: rule.options.bymonth ? rule.options.bymonth.map(v => String(v)) : []
                    })(
                        <Select
                            mode="multiple"
                            onChange={onCommit}>
                            <Select.Option value="1">January</Select.Option>
                            <Select.Option value="2">February</Select.Option>
                            <Select.Option value="3">March</Select.Option>
                            <Select.Option value="4">April</Select.Option>
                            <Select.Option value="5">May</Select.Option>
                            <Select.Option value="6">June</Select.Option>
                            <Select.Option value="7">July</Select.Option>
                            <Select.Option value="8">August</Select.Option>
                            <Select.Option value="9">September</Select.Option>
                            <Select.Option value="10">October</Select.Option>
                            <Select.Option value="11">November</Select.Option>
                            <Select.Option value="12">December</Select.Option>
                        </Select>
                    )}
                </Form.Item>
            )}
            {[RRule.YEARLY].includes(rule.options.freq) && (
                <Form.Item label="On the day(s) of the year">
                    {getFieldDecorator('byyearday', {
                        initialValue: rule.options.byyearday ? rule.options.byyearday.map(v => String(v)) : []
                    })(
                        <Select
                            mode="multiple"
                            onChange={onCommit}>
                            {Array.from(Array(366), (_, i) => (
                                <Select.Option key={String(i + 1)} value={String(i + 1)}>{i + 1}</Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
            )}
            {[RRule.YEARLY].includes(rule.options.freq) && (
                <Form.Item label="On the week(s) of the year">
                    {getFieldDecorator('byweekno', {
                        initialValue: rule.options.byweekno ? rule.options.byweekno.map(v => String(v)) : []
                    })(
                        <Select
                            mode="multiple"
                            onChange={onCommit}>
                            {Array.from(Array(52), (_, i) => (
                                <Select.Option key={String(i + 1)} value={String(i + 1)}>{i + 1}</Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
            )}
            <Form.Item label={(<strong>End</strong>)}>
                {getFieldDecorator('end', {
                    initialValue: rule.options.until ? 'UNTIL' : 'NEVER'
                })(
                    <Select
                        onBlur={onCommit}
                        disabled={rule.options.freq === 999}
                        style={{ width: 100 }}>
                        <Select.Option value="NEVER">Never</Select.Option>
                        <Select.Option value="UNTIL">Until</Select.Option>
                    </Select>
                )}
                {rule.options.until ? getFieldDecorator('endDate', {
                    initialValue: rule.options.until ? moment(rule.options.until) : moment()
                })(
                    <DatePicker onChange={onCommit} disabled={rule.options.freq === 999} />
                ) : null}
            </Form.Item>
            <Form.Item label={(<strong>Result</strong>)}>
                {toStringRepeat(props.repeat, true)}
            </Form.Item>
        </Form>
    );
}

RepeatForm.propTypes = {
    form: PropTypes.object.isRequired,
    repeat: RepeatPropType,
    updateRepeat: PropTypes.func.isRequired
};

export default Form.create({ name: 'repeat' })(RepeatForm);