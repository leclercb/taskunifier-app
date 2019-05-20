import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Spacer from 'components/common/Spacer';
import DraggableElement from 'components/common/table/DraggableElement';
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

    const children = (
        <React.Fragment>
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
                        [props.field.id]: getDefaultGetValueFromEvent(event)
                    })
                })}
        </React.Fragment>
    );

    if (props.dndEnabled) {
        return (
            <DraggableElement
                className={'cell-renderer-value-wrap ' + (props.field.editable ? 'editable' : '')}
                onDoubleClick={toggleEdit}
                dragType={props.dragType}
                dropType={props.dropType}
                data={props.dndData}
                onDrop={props.onDrop}>
                {children}
            </DraggableElement>
        );
    }

    return (
        <div
            className={'cell-renderer-value-wrap ' + (props.field.editable ? 'editable' : '')}
            onDoubleClick={toggleEdit}>
            {children}
        </div>
    );
}

CellRenderer.propTypes = {
    field: FieldPropType.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    subLevel: PropTypes.number,
    expandMode: PropTypes.oneOf(['expanded', 'collapsed', 'hidden']),
    onSetExpanded: PropTypes.func,
    dndEnabled: PropTypes.bool,
    dropType: PropTypes.string,
    dragType: PropTypes.string,
    dndData: PropTypes.object,
    onDrop: PropTypes.func
};

export default CellRenderer;