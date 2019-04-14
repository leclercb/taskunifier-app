import React, { useState, useRef } from 'react';
import { Form } from 'antd';
import { isAlwaysInEdition, getValuePropName, getInputForType } from '../../utils/FieldUtils';
import './EditableCell.css';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = Component => ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        {Component ? React.createElement(Component, props) : (
            <tr {...props} />
        )}
    </EditableContext.Provider>
);

export const EditableFormRow = Component => Form.create()(EditableRow(Component));

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

    return (
        <td {...restProps}>
            {editable ? (
                <EditableContext.Consumer>
                    {(form) => {
                        formRef.current = form;

                        return (
                            editing || isAlwaysInEdition(type) ? (
                                <FormItem style={{ margin: 0 }}>
                                    {form.getFieldDecorator(dataIndex, {
                                        rules: [],
                                        valuePropName: getValuePropName(type),
                                        initialValue: record[dataIndex],
                                    })(getInputForType(type, { ref: inputRef, onPressEnter: save, onBlur: save }))}
                                </FormItem>
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