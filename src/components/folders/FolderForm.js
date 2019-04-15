import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Checkbox } from 'antd';
import ColorPicker from 'rc-color-picker';
import { FolderPropType } from '../../proptypes/FolderPropTypes';
import { getDefaultFormItemLayout, getDefaultTailFormItemLayout, onFieldChangeForObjectUpdates } from '../../utils/FormUtils';

function FolderForm(props) {
    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();
    const tailFormItemLayout = getDefaultTailFormItemLayout();

    return (
        <Form {...formItemLayout}>
            <Form.Item label="Title">
                {getFieldDecorator('title', {
                    initialValue: props.folder.title,
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
                    initialValue: props.folder.color,
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
            <Form.Item {...tailFormItemLayout}>
                {getFieldDecorator('archived', {
                    initialValue: props.folder.archived,
                    valuePropName: 'checked'
                })(
                    <Checkbox>Archived</Checkbox>
                )}
            </Form.Item>
        </Form>
    );
}

FolderForm.propTypes = {
    folder: FolderPropType.isRequired,
    updateFolder: PropTypes.func.isRequired
};

export default Form.create({
    name: 'folder',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.folder, props.updateFolder)
})(FolderForm);