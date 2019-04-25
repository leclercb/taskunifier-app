import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import {
    getInputForType,
    getNormalizeForType,
    getValueFromEventForType,
    getValuePropNameForType,
    isAlwaysInEditionForType,
    isCommitOnChangeForType
} from 'utils/FieldUtils';
import './EditableCell.css';
import { FieldPropType } from 'proptypes/FieldPropTypes';

const EditableContext = React.createContext();

const EditableRow = Component => ({ form, ...props }) => {
    Object.assign(props.style, props.rowProps.style);

    const trProps = { ...props };
    delete trProps.rowProps;

    return (
        <EditableContext.Provider value={form}>
            {Component ? React.createElement(Component, props) : (
                <tr {...trProps} />
            )}
        </EditableContext.Provider>
    );
};

export const EditableFormRow = Component => Form.create({
    onValuesChange: (props, changedValues, allValues) => {
        if (isCommitOnChangeForType(props.rowProps.getField(Object.keys(changedValues)[0]).type)) {
            props.rowProps.onSave({ ...props.rowProps.record, ...allValues });
        }
    }
})(EditableRow(Component));

export function EditableCell(props) {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const formRef = useRef();

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

    const save = e => {
        const { record, onSave } = props;
        formRef.current.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }

            toggleEdit();
            onSave({ ...record, ...values });
        });
    };

    const {
        field,
        editable,
        dataIndex,
        record,
        ...restProps
    } = props;

    delete restProps.title;
    delete restProps.index;
    delete restProps.onSave;

    return (
        <td {...restProps}>
            {editable ? (
                <EditableContext.Consumer>
                    {form => {
                        formRef.current = form;

                        const extraProps = {};

                        if (!isCommitOnChangeForType(field.type)) {
                            extraProps.onPressEnter = save;
                            extraProps.onBlur = save;
                        }

                        return (
                            editing || isAlwaysInEditionForType(field.type) ? (
                                <Form.Item style={{ margin: 0 }}>
                                    {form.getFieldDecorator(dataIndex, {
                                        rules: [],
                                        valuePropName: getValuePropNameForType(field.type),
                                        getValueFromEvent: getValueFromEventForType(field.type),
                                        initialValue: getNormalizeForType(field.type)(record[dataIndex])
                                    })(
                                        getInputForType(field.type, field.options, { ref: inputRef, ...extraProps })
                                    )}
                                </Form.Item>
                            ) : (
                                    <div
                                        className="editable-cell-value-wrap"
                                        style={{ paddingRight: 24 }}
                                        onClick={toggleEdit}>
                                        {restProps.children}
                                    </div>
                                )
                        );
                    }}
                </EditableContext.Consumer>
            ) : restProps.children}
        </td>
    );
}

EditableCell.propTypes = {
    dataIndex: PropTypes.string,
    field: FieldPropType,
    style: PropTypes.object,
    rowProps: PropTypes.object,
    editable: PropTypes.bool,
    record: PropTypes.object,
    onSave: PropTypes.func,
};