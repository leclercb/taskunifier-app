import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { getFolderFields } from 'data/DataFolderFields';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { FolderPropType } from 'proptypes/FolderPropTypes';
import { getDefaultFormItemLayout, onCommitForm } from 'utils/FormUtils';

function FolderForm({ folder, updateFolder }) {
    const settingsApi = useSettingsApi();

    const [form] = Form.useForm();

    const fields = getFolderFields(settingsApi.settings);

    const formItemLayout = getDefaultFormItemLayout();

    const titleRef = useRef(null);

    useEffect(() => {
        form.resetFields();

        if (titleRef.current && !folder.title) {
            titleRef.current.focus();
        }
    }, [folder]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Form form={form} initialValues={folder} {...formItemLayout}>
            {fields.filter(field => field.visible !== false).map(field => (
                <Form.Item
                    key={field.id}
                    name={field.id}
                    label={field.title}
                    valuePropName={getValuePropNameForType(field.type)}>
                    {getInputForType(
                        field.type,
                        field.options,
                        {
                            ref: field.id === 'title' ? titleRef : undefined,
                            onCommit: () => onCommitForm(form, folder, updateFolder)
                        })}
                </Form.Item>
            ))}
        </Form>
    );
}

FolderForm.propTypes = {
    folder: FolderPropType.isRequired,
    updateFolder: PropTypes.func.isRequired
};

export default FolderForm;