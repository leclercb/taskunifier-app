import React from 'react';
import PropTypes from 'prop-types';
import { Form, Radio } from 'antd';
import { onFieldChangeForObjectUpdates } from 'utils/FormUtils';
import { RepeatPropType } from 'proptypes/RepeatPropTypes';

function RepeatWithParentForm(props) {
    const { getFieldDecorator } = props.form;

    const radioStyle = {
        display: 'block',
        height: '50px',
        lineHeight: '50px'
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
    repeat: RepeatPropType,
    updateRepeat: PropTypes.func.isRequired
};

export default Form.create({
    name: 'repeat',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.repeat, props.updateRepeat)
})(RepeatWithParentForm);