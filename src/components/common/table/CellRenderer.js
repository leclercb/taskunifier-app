import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Spacer from 'components/common/Spacer';
import ExpandCollapse from 'components/common/table/ExpandCollapse';
import EditableCell from 'components/common/table/EditableCell';
import { getDefaultGetValueFromEvent } from 'data/DataFieldTypes';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import {
    getRenderForType,
    isAlwaysInEditionForType
} from 'utils/FieldUtils';
import 'components/common/table/CellRenderer.css';

function CellRenderer(props) {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();

    const toggleEdit = () => {
        if (!props.field.editable) {
            return;
        }

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

    if (editing || isAlwaysInEditionForType(props.field.type)) {
        return (
            <EditableCell
                inputRef={inputRef}
                field={props.field}
                value={props.value}
                onChange={props.onChange}
                editing={editing}
                toggleEdit={toggleEdit} />
        );
    }

    return (
        <div
            className={'cell-renderer-value-wrap ' + (props.field.editable ? 'editable' : '')}
            onDoubleClick={toggleEdit}>
            {props.subLevel ? (
                <Spacer size={props.subLevel * 20} />
            ) : null}
            {props.expandMode ? (
                <ExpandCollapse expandMode={props.expandMode} onSetExpanded={props.onSetExpanded} />
            ) : null}
            {getRenderForType(
                props.field.type,
                props.field.options,
                props.value,
                {
                    onChange: event => props.onChange({
                        [props.field.id]: getDefaultGetValueFromEvent(props.field.type)(event)
                    })
                })}
        </div>
    );
}

CellRenderer.propTypes = {
    field: FieldPropType.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    subLevel: PropTypes.number,
    expandMode: PropTypes.oneOf(['expanded', 'collapsed', 'hidden']),
    onSetExpanded: PropTypes.func
};

export default CellRenderer;