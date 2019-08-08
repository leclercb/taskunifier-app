import React from 'react';
import PropTypes from 'prop-types';
import { Form, Radio } from 'antd';
import { onCommitForm } from 'utils/FormUtils';
import { RepeatPropType } from 'proptypes/RepeatPropTypes';

function RepeatWithParentForm(props) {
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

export default Form.create({ name: 'repeat' })(RepeatWithParentForm);