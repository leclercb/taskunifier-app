import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, InputNumber, Radio } from 'antd';
import { onFieldChangeForObjectUpdates } from 'utils/FormUtils';

function RepeatDailyForm(props) {
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
                <Radio style={radioStyle} value='everyday'>
                    Every day
                </Radio>
                <Radio style={radioStyle} value='everyweekday'>
                    Every weekday
                </Radio>
                <Radio style={radioStyle} value='everyweekend'>
                    Every weekend
                </Radio>
                <Radio style={radioStyle} value='everyxdays'>
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
                <Radio style={radioStyle} value='everyselectedday'>
                    <span style={{ marginRight: 10 }}>Every</span>
                    {getFieldDecorator('selectedDays', {
                        initialValue: props.repeat ? props.repeat.selectedDays : null,
                        rules: [
                            {
                                required: true,
                                message: 'The number of days is required',
                            }
                        ]
                    })(
                        <InputNumber min={0} />
                    )}
                </Radio>
            </Radio.Group>
        </Form>
    );
}

RepeatDailyForm.propTypes = {
    form: PropTypes.object.isRequired,
    repeat: PropTypes.object.isRequired,
    onUpdateRepeat: PropTypes.func.isRequired
};

export default Form.create({
    name: 'repeat',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.repeat, props.onUpdateRepeat)
})(RepeatDailyForm);