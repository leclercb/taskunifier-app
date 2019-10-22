import { useEffect } from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';

function EditableCell(props) {
    useEffect(() => {
        props.form.resetFields();
    }, [props.record.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const onChange = event => {
        props.form.validateFields((error, values) => {
            if (error && error[event.currentTarget.id]) {
                return;
            }

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

    return props.form.getFieldDecorator(props.field.id, {
        valuePropName: getValuePropNameForType(props.field.type),
        initialValue: props.value
    })(
        getInputForType(
            props.field.type,
            props.field.options,
            { ...inputProps })
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