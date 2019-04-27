import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, InputNumber, Radio } from 'antd';
import { onFieldChangeForObjectUpdates } from 'utils/FormUtils';

function RepeatYearlyForm(props) {
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
        </Form>
    );
}

RepeatYearlyForm.propTypes = {
    form: PropTypes.object.isRequired,
    repeat: PropTypes.object.isRequired,
    onUpdateRepeat: PropTypes.func.isRequired
};

export default Form.create({
    name: 'repeat',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.repeat, props.onUpdateRepeat)
})(RepeatYearlyForm);