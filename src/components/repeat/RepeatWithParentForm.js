import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, InputNumber, Radio } from 'antd';
import { onFieldChangeForObjectUpdates } from 'utils/FormUtils';

function RepeatWithParentForm(props) {
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
                <Radio style={radioStyle} value='withparent'>
                    With Parent
                </Radio>
            </Radio.Group>
        </Form>
    );
}

RepeatWithParentForm.propTypes = {
    form: PropTypes.object.isRequired,
    repeat: PropTypes.object.isRequired,
    onUpdateRepeat: PropTypes.func.isRequired
};

export default Form.create({
    name: 'repeat',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.repeat, props.onUpdateRepeat)
})(RepeatWithParentForm);