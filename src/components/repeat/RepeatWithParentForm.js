import React from 'react';
import PropTypes from 'prop-types';
import { Form, Radio } from 'antd';
import { onFieldChangeForObjectUpdates } from 'utils/FormUtils';

function RepeatWithParentForm(props) {
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
                    <Radio style={radioStyle} value='withParent'>
                        With Parent
                </Radio>
                </Radio.Group>
            )}
        </Form>
    );
}

RepeatWithParentForm.propTypes = {
    form: PropTypes.object.isRequired,
    repeat: PropTypes.object,
    onUpdateRepeat: PropTypes.func.isRequired
};

export default Form.create({
    name: 'repeat',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.repeat, props.onUpdateRepeat)
})(RepeatWithParentForm);