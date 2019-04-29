import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Form, InputNumber, Radio } from 'antd';
import { onFieldChangeForObjectUpdates } from 'utils/FormUtils';

function RepeatWeeklyForm(props) {
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
                    <Radio style={radioStyle} value='everyXWeeks'>
                        <span style={{ marginRight: 10 }}>Every</span>
                        {getFieldDecorator('nbWeeks', {
                            initialValue: props.repeat ? props.repeat.nbWeeks : null,
                            rules: [
                                {
                                    required: true,
                                    message: 'The number of weeks is required',
                                }
                            ]
                        })(
                            <InputNumber min={0} />
                        )}
                        <span style={{ marginLeft: 10 }}>week(s)</span>
                    </Radio>
                    <Radio style={radioStyle} value='everyXWeeksOnDaysY'>
                        <span style={{ marginRight: 10 }}>Every</span>
                        {getFieldDecorator('nbWeeks', {
                            initialValue: props.repeat ? props.repeat.nbWeeks : null,
                            rules: [
                                {
                                    required: true,
                                    message: 'The number of weeks is required',
                                }
                            ]
                        })(
                            <InputNumber min={0} />
                        )}
                        <span style={{ marginLeft: 10 }}>week(s) on</span>
                        <div style={{ marginLeft: 40 }}>
                            {getFieldDecorator('onDays', {
                                initialValue: props.repeat ? props.repeat.onDays : null,
                                rules: []
                            })(
                                <Checkbox.Group options={[
                                    { label: 'Monday', value: 'monday' },
                                    { label: 'Thuesday', value: 'tuesday' },
                                    { label: 'Wednesday', value: 'wednesday' },
                                    { label: 'Thursday', value: 'thursday' },
                                    { label: 'Friday', value: 'friday' },
                                    { label: 'Saturday', value: 'saturday' },
                                    { label: 'Sunday', value: 'sunday' }
                                ]} />
                            )}
                        </div>
                    </Radio>
                </Radio.Group>
            )}
        </Form>
    );
}

RepeatWeeklyForm.propTypes = {
    form: PropTypes.object.isRequired,
    repeat: PropTypes.object,
    onUpdateRepeat: PropTypes.func.isRequired
};

export default Form.create({
    name: 'repeat',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.repeat, props.onUpdateRepeat)
})(RepeatWeeklyForm);