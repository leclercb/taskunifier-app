import React, { useRef, useState } from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import {
    getInputForType,
    getNormalizeForType,
    getRenderForType,
    getValuePropNameForType,
    isAlwaysInEditionForType,
    isCommitOnChangeForType,
    getValueFromEventForType
} from 'utils/FieldUtils';
import 'components/common/grid/CellRenderer.css';

function CellRenderer(props) {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();

    const toggleEdit = () => {
        const newEditing = !editing;
        setEditing(newEditing);

        setTimeout(() => {
            if (newEditing && inputRef.current) {
                try {
                    inputRef.current.focus();
                } catch (err) {
                    // Don't do anything
                }
            }
        });
    };

    const onChange = event => {
        props.form.validateFields((error, values) => {
            if (error && error[event.currentTarget.id]) {
                return;
            }

            if (editing) {
                toggleEdit();
            }

            props.onChange(values);
        });
    };

    if (editing || isAlwaysInEditionForType(props.field.type)) {
        const inputProps = {
            ref: inputRef,
            fieldmode: 'grid'
        };

        if (editing) {
            inputProps.autoFocus = true;
        }

        if (!isCommitOnChangeForType(props.field.type)) {
            inputProps.onPressEnter = onChange;
            inputProps.onBlur = onChange;
        }

        return props.form.getFieldDecorator(props.field.id, {
            rules: [],
            valuePropName: getValuePropNameForType(props.field.type),
            getValueFromEvent: getValueFromEventForType(props.field.type),
            initialValue: getNormalizeForType(props.field.type)(props.value)
        })(getInputForType(
            props.field.type,
            props.field.options,
            { ...inputProps })
        );
    }

    return (
        <div
            className="cell-renderer-value-wrap"
            onDoubleClick={toggleEdit}>
            {getRenderForType(
                props.field.type,
                props.field.options,
                getNormalizeForType(props.field.type)(props.value),
                {
                    onChange: event => props.onChange({
                        [props.field.id]: getValueFromEventForType(props.field.type)(event)
                    })
                })}
        </div>
    );
}

CellRenderer.propTypes = {
    field: FieldPropType.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired
};

export default Form.create({
    onValuesChange: (props, changedValues, allValues) => {
        if (isCommitOnChangeForType(props.field.type)) {
            props.onChange(allValues);
        }
    }
})(CellRenderer);