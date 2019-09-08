import React from 'react';
import { Form, InputNumber, Select, DatePicker, Checkbox } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import RRule from 'rrule';
import { RepeatPropType } from 'proptypes/RepeatPropTypes';
import { getDefaultFormItemLayout } from 'utils/FormUtils';

function RepeatForm(props) {
    const { getFieldDecorator } = props.form;

    const onCommit = () => setTimeout(() => {
        props.form.validateFields((error, values) => {
            if (error) {
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

            props.updateRepeat(newRule.toString());
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
    }

    let rule = new RRule({
        freq: RRule.DAILY,
        interval: 1
    });

    try {
        if (props.repeat && typeof props.repeat === 'string') {
            rule = RRule.fromString(props.repeat);
        }
    } catch (error) {
        // Use default rule
    }

    return (
        <Form {...getDefaultFormItemLayout()}>
            <Form.Item label="Start">
                {getFieldDecorator('dtstart', {
                    initialValue: rule.options.dtstart ? moment(rule.options.dtstart) : undefined
                })(
                    <DatePicker onChange={onCommit} />
                )}
            </Form.Item>
            <Form.Item label="Repeat">
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
                    </Select>
                )}
                <br />
                <span style={{ marginRight: 10 }}>Every</span>
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
                {[RRule.DAILY, RRule.WEEKLY, RRule.MONTHLY, RRule.YEARLY].includes(rule.options.freq) && (
                    <React.Fragment>
                        <br />
                        <span style={{ marginRight: 10 }}>On the week day(s)</span>
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
                    </React.Fragment>
                )}
                {[RRule.DAILY, RRule.WEEKLY, RRule.MONTHLY, RRule.YEARLY].includes(rule.options.freq) && (
                    <React.Fragment>
                        <br />
                        <span style={{ marginRight: 10 }}>On the day(s) of the month</span>
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
                    </React.Fragment>
                )}
                {[RRule.DAILY, RRule.WEEKLY, RRule.MONTHLY, RRule.YEARLY].includes(rule.options.freq) && (
                    <React.Fragment>
                        <br />
                        <span style={{ marginRight: 10 }}>On the month(s)</span>
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
                    </React.Fragment>
                )}
                {[RRule.YEARLY].includes(rule.options.freq) && (
                    <React.Fragment>
                        <br />
                        <span style={{ marginRight: 10 }}>On the day(s) of the year</span>
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
                    </React.Fragment>
                )}
                {[RRule.YEARLY].includes(rule.options.freq) && (
                    <React.Fragment>
                        <br />
                        <span style={{ marginRight: 10 }}>On the week(s) of the year</span>
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
                    </React.Fragment>
                )}
            </Form.Item>
            <Form.Item label="End">
                {getFieldDecorator('end', {
                    initialValue: rule.options.until ? 'UNTIL' : 'NEVER'
                })(
                    <Select
                        onBlur={onCommit}
                        style={{ width: 100 }}>
                        <Select.Option value="NEVER">Never</Select.Option>
                        <Select.Option value="UNTIL">Until</Select.Option>
                    </Select>
                )}
                {rule.options.until ? getFieldDecorator('endDate', {
                    initialValue: rule.options.until ? moment(rule.options.until) : moment()
                })(
                    <DatePicker onChange={onCommit} />
                ) : null}
            </Form.Item>
            <Form.Item label="Result">
                {rule.toText()}
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