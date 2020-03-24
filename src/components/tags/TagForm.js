import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'antd';
import ColorPicker from 'components/common/ColorPicker';
import Icon from 'components/common/Icon';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { TagPropType } from 'proptypes/TagPropTypes';
import { getDefaultFormItemLayout, getDefaultTailFormItemLayout } from 'utils/FormUtils';
import { merge } from 'utils/ObjectUtils';

function TagForm({ tag, updateTag }) {
    const settingsApi = useSettingsApi();

    const [form] = Form.useForm();

    const formItemLayout = getDefaultFormItemLayout();
    const tailFormItemLayout = getDefaultTailFormItemLayout();

    useEffect(() => {
        form.resetFields();
    }, [tag]); // eslint-disable-line react-hooks/exhaustive-deps

    const onUpdateTag = async () => {
        try {
            const values = await form.validateFields();

            const updatedObject = merge({ ...tag }, values);
            updateTag(updatedObject);
        } catch (error) {
            // Skip
        }
    };

    const onCommit = async () => {
        try {
            const values = await form.validateFields();

            settingsApi.updateSettings({
                [`tagColor_${btoa(tag.title)}`]: values.color
            });
        } catch (error) {
            // Skip
        }
    };

    return (
        <Form form={form} initialValues={tag} {...formItemLayout}>
            <Form.Item
                name="title"
                label="Title"
                rules={[
                    {
                        required: true,
                        message: 'The title is required'
                    }
                ]}>
                <Input />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button onClick={() => onUpdateTag()}>
                    <Icon icon="tag" text="Change tag title in every task" />
                </Button>
            </Form.Item>
            <Form.Item
                name="color"
                label="Color"
                valuePropName="color">
                <ColorPicker onClose={onCommit} />
            </Form.Item>
        </Form>
    );
}

TagForm.propTypes = {
    tag: TagPropType.isRequired,
    updateTag: PropTypes.func.isRequired
};

export default TagForm;