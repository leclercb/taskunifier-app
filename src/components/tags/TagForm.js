import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'antd';
import ColorPicker from 'components/common/ColorPicker';
import Icon from 'components/common/Icon';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { TagPropType } from 'proptypes/TagPropTypes';
import { getDefaultFormItemLayout, getDefaultTailFormItemLayout } from 'utils/FormUtils';
import { merge } from 'utils/ObjectUtils';

function TagForm(props) {
    const settingsApi = useSettingsApi();

    const updateTag = () => {
        props.form.validateFields((error, values) => {
            if (error) {
                return;
            }

            const updatedObject = merge({ ...props.tag }, values);
            props.updateTag(updatedObject);
        });
    };

    const onCommit = () => {
        props.form.validateFields((error, values) => {
            if (error) {
                return;
            }

            settingsApi.updateSettings({
                [`tagColor_${btoa(props.tag.title)}`]: values.color
            });
        });
    };

    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();
    const tailFormItemLayout = getDefaultTailFormItemLayout();

    return (
        <Form {...formItemLayout}>
            <Form.Item label="Title">
                {getFieldDecorator('title', {
                    initialValue: props.tag.title,
                    rules: [
                        {
                            required: true,
                            message: 'The title is required'
                        }
                    ]
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button onClick={() => updateTag()}>
                    <Icon icon="tag" text="Change tag title in every task" />
                </Button>
            </Form.Item>
            <Form.Item label="Color">
                {getFieldDecorator('color', {
                    initialValue: props.tag.color,
                    valuePropName: 'color'
                })(
                    <ColorPicker onClose={onCommit} />
                )}
            </Form.Item>
        </Form>
    );
}

TagForm.propTypes = {
    form: PropTypes.object.isRequired,
    tag: TagPropType.isRequired,
    updateTag: PropTypes.func.isRequired
};

export default Form.create({ name: 'tag' })(TagForm);