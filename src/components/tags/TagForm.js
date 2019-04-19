import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import { TagPropType } from '../../proptypes/TagPropTypes';
import { getDefaultFormItemLayout, onFieldChangeForObjectUpdates } from '../../utils/FormUtils';

function TagForm(props) {
    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    return (
        <Form {...formItemLayout}>
            <Form.Item label="Title">
                {getFieldDecorator('title', {
                    initialValue: props.tag.title,
                    rules: [
                        {
                            required: true,
                            message: 'The title is required',
                        }
                    ]
                })(
                    <Input />
                )}
            </Form.Item>
        </Form>
    );
}

TagForm.propTypes = {
    tag: TagPropType.isRequired,
    updateTag: PropTypes.func.isRequired
};

export default Form.create({
    name: 'tag',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.tag, props.updateTag)
})(TagForm);