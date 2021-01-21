import React, { useEffect, useState } from 'react';
import { Form, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';

function EditableCell(props) {
    const [errors, setErrors] = useState([]);

    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
    }, [props.record.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const onChange = async () => {
        try {
            const values = await form.validateFields();

            setErrors([]);

            if (props.editing) {
                props.toggleEdit();
            }

            props.onChange(values);
        } catch (error) {
            const errors = (error && error.errorFields ? error.errorFields : [])
                .filter(field => field.name.includes(props.field.id))
                .reduce((array, field) => array.concat(field.errors), []);

            setErrors(errors);
        }
    };

    const inputProps = {
        fieldMode: 'table',
        size: 'small',
        onCommit: () => setTimeout(() => onChange()),
        onStopEdition: () => setTimeout(() => {
            if (props.editing) {
                props.toggleEdit();
            }
        })
    };

    if (props.editing) {
        inputProps.autoFocus = true;
    }

    return (
        <Tooltip
            visible={errors.length > 0}
            title={errors.map(error => <p key={error}>{error}</p>)}>
            <Form form={form} initialValues={{ [props.field.id]: props.value }}>
                <Form.Item
                    noStyle
                    name={props.field.id}
                    valuePropName={getValuePropNameForType(props.field.type)}
                    rules={props.field.rules ? props.field.rules(props.record) : []}>
                    {getInputForType(props.field.type, props.field.options, { ...inputProps })}
                </Form.Item>
            </Form>
        </Tooltip>
    );
}

EditableCell.propTypes = {
    record: PropTypes.object.isRequired,
    field: FieldPropType.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired,
    toggleEdit: PropTypes.func.isRequired
};

export default EditableCell;