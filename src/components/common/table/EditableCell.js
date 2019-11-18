import React, { useEffect, useState } from 'react';
import { Form, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';

function EditableCell(props) {
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        props.form.resetFields();
    }, [props.record.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const onChange = () => {
        props.form.validateFields((error, values) => {
            if (error && error[props.field.id]) {
                setErrors(error[props.field.id].errors);
                return;
            }

            setErrors([]);

            if (props.editing) {
                props.toggleEdit();
            }

            props.onChange(values);
        });
    };

    const inputProps = {
        fieldMode: 'table',
        size: 'small',
        onCommit: () => setTimeout(() => onChange())
    };

    if (props.editing) {
        inputProps.autoFocus = true;
    }

    return (
        <Tooltip
            visible={errors.length > 0}
            title={errors.map(error => <p key={error.field}>{error.message}</p>)}>
            {props.form.getFieldDecorator(props.field.id, {
                valuePropName: getValuePropNameForType(props.field.type),
                initialValue: props.value,
                rules: props.field.rules ? props.field.rules(props.record) : []
            })(
                getInputForType(
                    props.field.type,
                    props.field.options,
                    { ...inputProps })
            )}
        </Tooltip>
    );
}

EditableCell.propTypes = {
    form: PropTypes.object.isRequired,
    record: PropTypes.object.isRequired,
    field: FieldPropType.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired,
    toggleEdit: PropTypes.func.isRequired
};

export default Form.create()(EditableCell);