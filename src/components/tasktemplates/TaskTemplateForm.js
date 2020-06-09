import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Divider, Form, Input } from 'antd';
import ColorPicker from 'components/common/ColorPicker';
import withBusyCheck from 'containers/WithBusyCheck';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { TaskTemplatePropType } from 'proptypes/TaskTemplatePropTypes';
import { getDefaultFormItemLayout, onCommitForm } from 'utils/FormUtils';

function TaskTemplateForm({ apis, taskTemplate, updateTaskTemplate }) {
    const { settingsApi, taskFieldApi } = apis;

    const [form] = Form.useForm();

    const formItemLayout = getDefaultFormItemLayout();

    const titleRef = useRef(null);

    useEffect(() => {
        form.resetFields();

        if (titleRef.current && !taskTemplate.title) {
            titleRef.current.focus();
        }
    }, [taskTemplate]); // eslint-disable-line react-hooks/exhaustive-deps

    const fields = taskFieldApi.taskFields.filter(field => field.editable && settingsApi.settings['taskFieldVisible_' + field.id] !== false);

    const onCommit = () => onCommitForm(form, taskTemplate, updateTaskTemplate);

    return (
        <Form form={form} initialValues={taskTemplate} {...formItemLayout}>
            <Form.Item
                name="title"
                label="Title"
                rules={[
                    {
                        required: true,
                        message: 'The title is required'
                    }
                ]}>
                <Input ref={titleRef} onBlur={onCommit} />
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
                <ColorPicker onClose={onCommit} />
            </Form.Item>
            <Divider>Task Properties</Divider>
            {fields.map(field => (
                <Form.Item
                    key={field.id}
                    name={['properties', field.id]}
                    label={field.title}
                    valuePropName={getValuePropNameForType(field.type)}>
                    {getInputForType(
                        field.type,
                        { ...field.options, ...(field.type === 'date' || field.type === 'dateTime' ? { extended: true } : {}) },
                        { onCommit })}
                </Form.Item>
            ))}
        </Form>
    );
}

TaskTemplateForm.propTypes = {
    apis: PropTypes.object.isRequired,
    taskTemplate: TaskTemplatePropType.isRequired,
    updateTaskTemplate: PropTypes.func.isRequired
};

export default withBusyCheck(TaskTemplateForm, () => ({
    settingsApi: useSettingsApi(),
    taskFieldApi: useTaskFieldApi()
}));