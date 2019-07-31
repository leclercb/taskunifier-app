import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { getFolderFields } from 'data/DataFolderFields';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { FolderPropType } from 'proptypes/FolderPropTypes';
import { getDefaultFormItemLayout, onCommitForm } from 'utils/FormUtils';

function FolderForm(props) {
    const fields = getFolderFields();

    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    return (
        <Form {...formItemLayout}>
            {fields.filter(field => field.visible !== false).map(field => (
                <Form.Item key={field.id} label={field.title}>
                    {getFieldDecorator(field.id, {
                        valuePropName: getValuePropNameForType(field.type),
                        initialValue: props.folder[field.id]
                    })(
                        getInputForType(
                            field.type,
                            field.options,
                            {
                                onCommit: () => onCommitForm(props.form, props.folder, props.updateFolder)
                            })
                    )}
                </Form.Item>
            ))}
        </Form>
    );
}

FolderForm.propTypes = {
    form: PropTypes.object.isRequired,
    folder: FolderPropType.isRequired,
    updateFolder: PropTypes.func.isRequired
};

export default Form.create({ name: 'folder' })(FolderForm);