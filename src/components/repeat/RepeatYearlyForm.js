import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Radio } from 'antd';
import { onFieldChangeForObjectUpdates } from 'utils/FormUtils';

function RepeatYearlyForm(props) {
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
                    <Radio style={radioStyle} value='everyxyears'>
                        <span style={{ marginRight: 10 }}>Every</span>
                        {getFieldDecorator('nbYears', {
                            initialValue: props.repeat ? props.repeat.nbYears : null,
                            rules: [
                                {
                                    required: true,
                                    message: 'The number of years is required',
                                }
                            ]
                        })(
                            <InputNumber min={0} />
                        )}
                        <span style={{ marginLeft: 10 }}>year(s)</span>
                    </Radio>
                </Radio.Group>
            )}
        </Form>
    );
}

RepeatYearlyForm.propTypes = {
    form: PropTypes.object.isRequired,
    repeat: PropTypes.object,
    onUpdateRepeat: PropTypes.func.isRequired
};

export default Form.create({
    name: 'repeat',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.repeat, props.onUpdateRepeat)
})(RepeatYearlyForm);