import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import ColorPicker from '../common/ColorPicker';
import { NoteFilterPropType } from '../../proptypes/NoteFilterPropTypes';
import { getDefaultFormItemLayout, onFieldChangeForObjectUpdates } from 'utils/FormUtils';

function NoteFilterForm(props) {
    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    return (
        <Form {...formItemLayout}>
            <Form.Item label="Title">
                {getFieldDecorator('title', {
                    initialValue: props.noteFilter.title,
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
            <Form.Item label="Color">
                {getFieldDecorator('color', {
                    initialValue: props.noteFilter.color,
                    valuePropName: 'color',
                    getValueFromEvent: event => event.color,
                    rules: [
                        {
                            required: true, message: 'The color is required',
                        }
                    ]
                })(
                    <ColorPicker />
                )}
            </Form.Item>
        </Form>
    );
}

NoteFilterForm.propTypes = {
    noteFilter: NoteFilterPropType.isRequired,
    updateNoteFilter: PropTypes.func.isRequired
};

export default Form.create({
    name: 'noteFilter',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.noteFilter, props.updateNoteFilter)
})(NoteFilterForm);