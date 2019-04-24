import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import { NotePropType } from 'proptypes/NotePropTypes';

function NoteNoteForm(props) {
    const { getFieldDecorator } = props.form;

    const formItemLayout = {
        labelCol: 0,
        wrapperCol: 24
    };

    const onSave = () => {
        props.form.validateFields((error, values) => {
            if (error) {
                return;
            }

            props.updateNote({ ...props.note, ...values });
        });
    };

    return (
        <Form {...formItemLayout}>
            <Form.Item>
                {getFieldDecorator('note', {
                    initialValue: props.note.note
                })(
                    <Input.TextArea autosize={{ minRows: 5 }} onBlur={onSave} />
                )}
            </Form.Item>
        </Form>
    );
}

NoteNoteForm.propTypes = {
    note: NotePropType.isRequired,
    updateNote: PropTypes.func.isRequired
};

export default Form.create({ name: 'noteNote' })(NoteNoteForm);