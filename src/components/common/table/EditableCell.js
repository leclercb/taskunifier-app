import { Form } from 'antd';
import PropTypes from 'prop-types';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import {
    getInputForType,
    getValuePropNameForType,
    isCommitOnChangeForType
} from 'utils/FieldUtils';

function EditableCell(props) {
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
        ref: props.inputRef,
        fieldmode: 'table'
    };

    if (props.editing) {
        inputProps.autoFocus = true;
    }

    if (!isCommitOnChangeForType(props.field.type)) {
        inputProps.onPressEnter = onChange;
        inputProps.onBlur = onChange;
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
    inputRef: PropTypes.any.isRequired,
    field: FieldPropType.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired,
    toggleEdit: PropTypes.func.isRequired
};

export default Form.create({
    onValuesChange: (props, changedValues, allValues) => {
        if (isCommitOnChangeForType(props.field.type)) {
            props.onChange(allValues);
            props.toggleEdit();
        }
    }
})(EditableCell);