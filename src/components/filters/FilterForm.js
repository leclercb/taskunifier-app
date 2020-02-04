import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select } from 'antd';
import ColorPicker from 'components/common/ColorPicker';
import { FilterPropType } from 'proptypes/FilterPropTypes';
import { getDefaultFormItemLayout, onCommitForm } from 'utils/FormUtils';

function FilterForm({ filter, updateFilter, disabled }) {
    const [form] = Form.useForm();

    const formItemLayout = getDefaultFormItemLayout();

    const titleRef = useRef(null);

    useEffect(() => {
        if (titleRef.current && !filter.title) {
            titleRef.current.focus();
        }
    }, [filter.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const onCommit = () => onCommitForm(form, filter, updateFilter);

    return (
        <Form form={form} initialValues={filter} {...formItemLayout}>
            <Form.Item
                name="title"
                label="Title"
                rules={[
                    {
                        required: true,
                        message: 'The title is required'
                    }
                ]}>
                <Input ref={titleRef} onBlur={onCommit} disabled={disabled} />
            </Form.Item>
            <Form.Item
                name="color"
                label="Color"
                valuePropName="color"
                rules={[
                    {
                        required: true,
                        message: 'The color is required'
                    }
                ]}>
                <ColorPicker onClose={onCommit} disabled={disabled} />
            </Form.Item>
            <Form.Item
                name="directory"
                label="Directory"
                rules={[
                    {
                        required: true,
                        message: 'The directory is required'
                    }
                ]}>
                <Select onBlur={onCommit} disabled={disabled}>
                    <Select.Option value="default">Default</Select.Option>
                    <Select.Option value="general">General</Select.Option>
                </Select>
            </Form.Item>
        </Form>
    );
}

FilterForm.propTypes = {
    filter: FilterPropType.isRequired,
    updateFilter: PropTypes.func,
    disabled: PropTypes.bool
};

export default FilterForm;