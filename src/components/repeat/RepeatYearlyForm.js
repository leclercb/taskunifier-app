import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Radio } from 'antd';
import { onFieldChangeForObjectUpdates } from 'utils/FormUtils';
import { RepeatPropType } from 'proptypes/RepeatPropTypes';

function RepeatYearlyForm(props) {
    const { getFieldDecorator } = props.form;

    const radioStyle = {
        display: 'block',
        height: '50px',
        lineHeight: '50px'
    };

    return (
        <Form>
            {getFieldDecorator('type', {
                initialValue: props.repeat ? props.repeat.type : undefined
            })(
                <Radio.Group>
                    <Radio style={radioStyle} value='everyXYears'>
                        <span style={{ marginRight: 10 }}>Every</span>
                        {getFieldDecorator('nbYears', {
                            initialValue: props.repeat ? props.repeat.nbYears : undefined,
                            rules: [
                                {
                                    required: true,
                                    message: 'The number of years is required'
                                }
                            ]
                        })(
                            <InputNumber min={1} disabled={props.repeat.type !== 'everyXYears'} />
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
    repeat: RepeatPropType,
    updateRepeat: PropTypes.func.isRequired
};

export default Form.create({
    name: 'repeat',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.repeat, props.updateRepeat)
})(RepeatYearlyForm);