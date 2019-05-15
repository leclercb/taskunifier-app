import React, { useRef, useState } from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import Spacer from 'components/common/Spacer';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import {
    getInputForType,
    getNormalizeForType,
    getRenderForType,
    getValueFromEventForType,
    getValuePropNameForType,
    isAlwaysInEditionForType,
    isCommitOnChangeForType
} from 'utils/FieldUtils';
import 'components/common/table/CellRenderer.css';
import Constants from 'constants/Constants';

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
            fieldmode: 'table'
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

    let indentationElement = null;
    let expandElement = null;

    if (props.subLevel) {
        indentationElement = (
            <Spacer size={props.subLevel * 20} />
        );
    }

    if (props.expandMode) {
        let expanded;
        let icon;
        let color;

        switch (props.expandMode) {
            case 'expanded':
                expanded = true;
                icon = 'minus-square';
                color = Constants.color;
                break;
            case 'collapsed':
                expanded = false;
                icon = 'plus-square';
                color = Constants.color;
                break;
            default:
            case 'hidden':
                expanded = false;
                icon = 'plus-square';
                color = 'transparent';
                break;
        }

        expandElement = (
            <Icon
                icon={icon}
                color={color}
                style={{
                    marginRight: 5
                }}
                onClick={() => props.onSetExpanded(!expanded)} />
        );
    }

    return (
        <div
            className="cell-renderer-value-wrap"
            onDoubleClick={toggleEdit}>
            {indentationElement}
            {expandElement}
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
    form: PropTypes.object.isRequired,
    field: FieldPropType.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    subLevel: PropTypes.number,
    expandMode: PropTypes.oneOf(['expanded', 'collapsed', 'hidden']),
    onSetExpanded: PropTypes.func
};

export default Form.create({
    onValuesChange: (props, changedValues, allValues) => {
        if (isCommitOnChangeForType(props.field.type)) {
            props.onChange(allValues);
        }
    }
})(CellRenderer);