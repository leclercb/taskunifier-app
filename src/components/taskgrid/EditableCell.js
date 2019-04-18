import React, { useState, useRef } from 'react';
import { Form } from 'antd';
import {
    isAlwaysInEditionForType,
    getValuePropNameForType,
    getValueFromEventForType,
    getInputForType,
    getNormalizeForType,
    isCommitOnChangeForType
} from '../../utils/FieldUtils';
import './EditableCell.css';

const EditableContext = React.createContext();

const EditableRow = Component => ({ form, index, rowProps, ...props }) => {
    Object.assign(props.style, rowProps.style);

    return (
        <EditableContext.Provider value={form}>
            {Component ? React.createElement(Component, props) : (
                <tr {...props} />
            )}
        </EditableContext.Provider>
    );
};

export const EditableFormRow = Component => Form.create({
    onValuesChange: (props, changedValues, allValues) => {
        if (isCommitOnChangeForType(props.rowProps.getFieldType(Object.keys(changedValues)[0]))) {
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
    }

    const save = e => {
        const { record, onSave } = props;
        formRef.current.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }

            toggleEdit();
            onSave({ ...record, ...values });
        });
    }

    const {
        type,
        editable,
        dataIndex,
        title,
        record,
        index,
        onSave,
        ...restProps
    } = props;

    const extraProps = {};

    if (!isCommitOnChangeForType(type)) {
        extraProps.onPressEnter = save;
        extraProps.onBlur = save;
    }

    return (
        <td {...restProps}>
            {editable ? (
                <EditableContext.Consumer>
                    {(form) => {
                        formRef.current = form;

                        return (
                            editing || isAlwaysInEditionForType(type) ? (
                                <Form.Item style={{ margin: 0 }}>
                                    {form.getFieldDecorator(dataIndex, {
                                        rules: [],
                                        valuePropName: getValuePropNameForType(type),
                                        getValueFromEvent: getValueFromEventForType(type),
                                        initialValue: getNormalizeForType(type)(record[dataIndex])
                                    })(
                                        getInputForType(type, { ref: inputRef, ...extraProps })
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