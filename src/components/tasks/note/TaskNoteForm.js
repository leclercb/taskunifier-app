import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import { TaskPropType } from 'proptypes/TaskPropTypes';

function TaskNoteForm(props) {
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

            props.updateTask({ ...props.task, ...values });
        });
    };

    return (
        <Form {...formItemLayout}>
            <Form.Item>
                {getFieldDecorator('note', {
                    initialValue: props.task.note
                })(
                    <Input.TextArea autosize={{ minRows: 5 }} onBlur={onSave} />
                )}
            </Form.Item>
        </Form>
    );
}

TaskNoteForm.propTypes = {
    task: TaskPropType.isRequired,
    updateTask: PropTypes.func.isRequired
};

export default Form.create({ name: 'taskNote' })(TaskNoteForm);