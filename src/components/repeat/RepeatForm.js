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
                freq: values.freq,
                interval: values.interval,
                byweekday: Number.parseInt(values.byweekday),
                until: values.end === 'UNTIL' ? (values.endDate ? values.endDate.toDate() : moment()) : undefined
            });

            props.updateRepeat(newRule.toString());
        });
    });

    const getUnitFromFreq = freq => {
        switch (freq) {
            case RRule.SECONDLY: return 'second';
            case RRule.MINUTELY: return 'minute';
            case RRule.HOURLY: return 'hour';
            case RRule.DAILY: return 'day';
            case RRule.WEEKLY: return 'week';
            case RRule.MONTHLY: return 'month';
            case RRule.YEARLY: return 'year';
            default: return '';
        }
    }

    let rule = new RRule({ freq: RRule.DAILY });

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
                    initialValue: rule.options.freq ? rule.options.freq : RRule.DAILY
                })(
                    <Select
                        onBlur={onCommit}
                        style={{ width: 300 }}>
                        <Select.Option value={RRule.SECONDLY}>Secondly</Select.Option>
                        <Select.Option value={RRule.MINUTELY}>Minutely</Select.Option>
                        <Select.Option value={RRule.HOURLY}>Hourly</Select.Option>
                        <Select.Option value={RRule.DAILY}>Daily</Select.Option>
                        <Select.Option value={RRule.WEEKLY}>Weekly</Select.Option>
                        <Select.Option value={RRule.MONTHLY}>Monthly</Select.Option>
                        <Select.Option value={RRule.YEARLY}>Yearly</Select.Option>
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
                {rule.options.freq === RRule.WEEKLY && (
                    <React.Fragment>
                        <br />
                        <span style={{ marginRight: 10 }}>On </span>
                        <div style={{ marginLeft: 40 }}>
                            {getFieldDecorator('byweekday', {
                                initialValue: rule.options.byweekday ? rule.options.byweekday : []
                            })(
                                <Checkbox.Group
                                    onChange={onCommit}
                                    options={[
                                        {
                                            label: 'Monday',
                                            value: String(RRule.MO)
                                        },
                                        {
                                            label: 'Tuesday',
                                            value: String(RRule.TU)
                                        },
                                        {
                                            label: 'Wednesday',
                                            value: String(RRule.WE)
                                        },
                                        {
                                            label: 'Thursday',
                                            value: String(RRule.TH)
                                        },
                                        {
                                            label: 'Friday',
                                            value: String(RRule.FR)
                                        },
                                        {
                                            label: 'Saturday',
                                            value: String(RRule.SA)
                                        },
                                        {
                                            label: 'Sunday',
                                            value: String(RRule.SU)
                                        }
                                    ]} />
                            )}
                        </div>
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
        </Form>
    );
}

RepeatForm.propTypes = {
    form: PropTypes.object.isRequired,
    repeat: RepeatPropType,
    updateRepeat: PropTypes.func.isRequired
};

export default Form.create({ name: 'repeat' })(RepeatForm);