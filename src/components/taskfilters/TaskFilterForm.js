import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import ColorPicker from 'components/common/ColorPicker';
import { TaskFilterPropType } from 'proptypes/TaskFilterPropTypes';
import { getDefaultFormItemLayout, onFieldChangeForObjectUpdates } from 'utils/FormUtils';

function TaskFilterForm(props) {
    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    return (
        <Form {...formItemLayout}>
            <Form.Item label="Title">
                {getFieldDecorator('title', {
                    initialValue: props.taskFilter.title,
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
                    initialValue: props.taskFilter.color,
                    valuePropName: 'color',
                    getValueFromEvent: event => event.color,
                    rules: [
                        {
                            required: true, 
                            message: 'The color is required',
                        }
                    ]
                })(
                    <ColorPicker />
                )}
            </Form.Item>
        </Form>
    );
}

TaskFilterForm.propTypes = {
    form: PropTypes.object.isRequired,
    taskFilter: TaskFilterPropType.isRequired,
    updateTaskFilter: PropTypes.func.isRequired
};

export default Form.create({
    name: 'taskFilter',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.taskFilter, props.updateTaskFilter)
})(TaskFilterForm);