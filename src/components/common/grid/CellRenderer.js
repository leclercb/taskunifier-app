import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import {
    getInputForType,
    getNormalizeForType,
    getRenderForType,
    getValuePropNameForType,
    isAlwaysInEditionForType,
    isCommitOnChangeForType
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
        toggleEdit();
        props.onChange(event);
    };

    if (editing || isAlwaysInEditionForType(props.field.type)) {
        let defaultValuePropName = getValuePropNameForType(props.field.type);
        defaultValuePropName = 'default' + defaultValuePropName.charAt(0).toUpperCase() + defaultValuePropName.slice(1);

        const inputProps = {
            ref: inputRef,
            fieldmode: 'grid',
            [defaultValuePropName]: getNormalizeForType(props.field.type)(props.value)
        };

        if (editing) {
            inputProps.autoFocus = true;
        }

        if (isCommitOnChangeForType(props.field.type)) {
            inputProps.onChange = onChange;
        } else {
            inputProps.onPressEnter = onChange;
            inputProps.onBlur = onChange;
        }

        return getInputForType(
            props.field.type,
            props.field.options,
            { ...inputProps }
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
                    onChange: onChange
                })}
        </div>
    );
}

CellRenderer.propTypes = {
    field: FieldPropType.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired
};

export default CellRenderer;