import React from 'react';
import { Checkbox, DatePicker, Form, InputNumber, Radio, Select } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import RRule from 'rrule';
import { RepeatPropType } from 'proptypes/RepeatPropTypes';
import { getDefaultFormItemLayout } from 'utils/FormUtils';
import { getOptionsFromValue } from 'utils/RepeatUtils';
import { toStringRepeat } from 'utils/StringUtils';

function RepeatForm({ repeat, updateRepeat }) {
    const [form] = Form.useForm();

    const onCommit = () => setTimeout(async () => {
        try {
            const values = await form.validateFields();

            if (Number.parseInt(values.freq) === -1) {
                updateRepeat(null);
                return;
            }

            if (Number.parseInt(values.freq) === 999) {
                updateRepeat('PARENT');
                return;
            }

            const newRule = new RRule({
                dtstart: values.start === 'FROM' ? (values.dtstart && values.dtstart.unix() !== 0 ? values.dtstart : moment()).toDate() : new Date(0),
                freq: Number.parseInt(values.freq),
                interval: values.interval,
                byweekday: values.byweekday ? values.byweekday.map(v => Number.parseInt(v)) : [],
                bymonthday: values.bymonthday ? values.bymonthday.map(v => Number.parseInt(v)) : [],
                bymonth: values.bymonth ? values.bymonth.map(v => Number.parseInt(v)) : [],
                byyearday: values.byyearday ? values.byyearday.map(v => Number.parseInt(v)) : [],
                byweekno: values.byweekno ? values.byweekno.map(v => Number.parseInt(v)) : [],
                until: values.end === 'UNTIL' ? (values.until ? values.until : moment()).toDate() : undefined
            });

            let newRuleStr = newRule.toString();

            if (values.from === 'completionDate') {
                newRuleStr += ';FROMCOMP';
            } else if (values.fastForward) {
                newRuleStr += ';FASTFORWARD';
            }

            console.debug(newRuleStr);
            updateRepeat(newRuleStr);
        } catch (error) {
            // Skip
        }
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

    let options = null;

    let fromCompletionDate = false;
    let fastForward = false;

    if (repeat && typeof repeat === 'string') {
        options = {
            dtstart: new Date(0),
            freq: RRule.DAILY,
            interval: 1
        };

        if (repeat === 'PARENT') {
            options.freq = 999;
        } else {
            options = getOptionsFromValue(repeat);

            fromCompletionDate = repeat.includes(';FROMCOMP');
            fastForward = repeat.includes(';FASTFORWARD');
        }
    }

    const values = {
        start: options && options.dtstart && options.dtstart.getTime() !== 0 ? 'FROM' : 'NONE',
        dtstart: options && options.dtstart ? moment(options.dtstart) : moment(),
        freq: String(options && options.freq ? options.freq : -1),
        from: fromCompletionDate ? 'completionDate' : 'dueDate',
        fastForward,
        interval: options && options.interval ? options.interval : 1,
        byweekday: options && options.byweekday ? options.byweekday.map(v => String(v)) : [],
        bymonthday: options && options.bymonthday ? options.bymonthday.map(v => String(v)) : [],
        bymonth: options && options.bymonth ? options.bymonth.map(v => String(v)) : [],
        byyearday: options && options.byyearday ? options.byyearday.map(v => String(v)) : [],
        byweekno: options && options.byweekno ? options.byweekno.map(v => String(v)) : [],
        end: options && options.until ? 'UNTIL' : 'NEVER',
        until: options && options.until ? moment(options.until) : moment()
    };

    return (
        <Form form={form} initialValues={values} {...getDefaultFormItemLayout()}>
            <Form.Item label={(<strong>Start</strong>)}>
                <Form.Item
                    noStyle
                    name="start">
                    <Select
                        onBlur={onCommit}
                        disabled={!options || options.freq === 999}
                        style={{ width: 100 }}>
                        <Select.Option value="NONE">None</Select.Option>
                        <Select.Option value="FROM">From</Select.Option>
                    </Select>
                </Form.Item>
                {options && options.dtstart && options.dtstart.getTime() !== 0 ? (
                    <Form.Item
                        noStyle
                        name="dtstart">
                        <DatePicker onChange={onCommit} disabled={options.freq === 999} style={{ marginLeft: 10 }} />
                    </Form.Item>
                ) : null}
            </Form.Item>
            <Form.Item
                name="freq"
                label={(<strong>Repeat</strong>)}>
                <Select
                    onBlur={onCommit}
                    style={{ width: 200 }}>
                    <Select.Option value="-1">Do Not Repeat</Select.Option>
                    <Select.Option value={String(RRule.DAILY)}>Daily</Select.Option>
                    <Select.Option value={String(RRule.WEEKLY)}>Weekly</Select.Option>
                    <Select.Option value={String(RRule.MONTHLY)}>Monthly</Select.Option>
                    <Select.Option value={String(RRule.YEARLY)}>Yearly</Select.Option>
                    <Select.Option value="999">With Parent</Select.Option>
                </Select>
            </Form.Item>
            {options && options.freq !== 999 && (
                <Form.Item label="Repeat from">
                    <Form.Item
                        noStyle
                        name="from"
                        rules={[
                            {
                                required: true,
                                message: 'This field is required'
                            }
                        ]}>
                        <Radio.Group onChange={onCommit}>
                            <Radio value="completionDate">Completion date</Radio>
                            <Radio value="dueDate">Due date</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {!fromCompletionDate && (
                        <Form.Item
                            noStyle
                            name="fastForward"
                            valuePropName="checked">
                            <Checkbox onChange={onCommit}>Fast forward</Checkbox>
                        </Form.Item>
                    )}
                </Form.Item>
            )}
            {options && options.freq !== 999 && (
                <Form.Item label="Every">
                    <Form.Item
                        noStyle
                        name="interval"
                        rules={[
                            {
                                required: true,
                                message: 'The interval is required'
                            }
                        ]}>
                        <InputNumber
                            onBlur={onCommit}
                            min={1} />
                    </Form.Item>
                    <span style={{ marginLeft: 10 }}>{getUnitFromFreq(options.freq)}(s)</span>
                </Form.Item>
            )}
            {options && [RRule.DAILY, RRule.WEEKLY, RRule.MONTHLY, RRule.YEARLY].includes(options.freq) && (
                <Form.Item
                    name="byweekday"
                    label="On the week day(s)">
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
                </Form.Item>
            )}
            {options && [RRule.DAILY, RRule.WEEKLY, RRule.MONTHLY, RRule.YEARLY].includes(options.freq) && (
                <Form.Item
                    name="bymonthday"
                    label="On the day(s) of the month">
                    <Select
                        mode="multiple"
                        onChange={onCommit}>
                        {Array.from(Array(31), (_, i) => (
                            <Select.Option key={String(i + 1)} value={String(i + 1)}>{i + 1}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            )}
            {options && [RRule.DAILY, RRule.WEEKLY, RRule.MONTHLY, RRule.YEARLY].includes(options.freq) && (
                <Form.Item
                    name="bymonth"
                    label="On the month(s)">
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
                </Form.Item>
            )}
            {options && [RRule.YEARLY].includes(options.freq) && (
                <Form.Item
                    name="byyearday"
                    label="On the day(s) of the year">
                    <Select
                        mode="multiple"
                        onChange={onCommit}>
                        {Array.from(Array(366), (_, i) => (
                            <Select.Option key={String(i + 1)} value={String(i + 1)}>{i + 1}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            )}
            {options && [RRule.YEARLY].includes(options.freq) && (
                <Form.Item
                    name="byweekno"
                    label="On the week(s) of the year">
                    <Select
                        mode="multiple"
                        onChange={onCommit}>
                        {Array.from(Array(52), (_, i) => (
                            <Select.Option key={String(i + 1)} value={String(i + 1)}>{i + 1}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            )}
            <Form.Item label={(<strong>End</strong>)}>
                <Form.Item
                    noStyle
                    name="end">
                    <Select
                        onBlur={onCommit}
                        disabled={!options || options.freq === 999}
                        style={{ width: 100 }}>
                        <Select.Option value="NEVER">Never</Select.Option>
                        <Select.Option value="UNTIL">Until</Select.Option>
                    </Select>
                </Form.Item>
                {options && options.until ? (
                    <Form.Item
                        noStyle
                        name="until">
                        <DatePicker onChange={onCommit} disabled={options.freq === 999} style={{ marginLeft: 10 }} />
                    </Form.Item>
                ) : null}
            </Form.Item>
            <Form.Item label={(<strong>Result</strong>)}>
                {toStringRepeat(repeat, true)}
            </Form.Item>
        </Form>
    );
}

RepeatForm.propTypes = {
    repeat: RepeatPropType,
    updateRepeat: PropTypes.func.isRequired
};

export default RepeatForm;