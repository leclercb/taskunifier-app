import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Radio } from 'antd';
import { onCommitForm } from 'utils/FormUtils';
import { RepeatPropType } from 'proptypes/RepeatPropTypes';

function RepeatYearlyForm(props) {
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
                            <InputNumber
                                onBlur={onCommit}
                                min={1}
                                disabled={props.repeat.type !== 'everyXYears'} />
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

export default Form.create({ name: 'repeat' })(RepeatYearlyForm);