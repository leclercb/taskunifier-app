import React from 'react';
import { Checkbox, Input, Form } from 'antd';
import './EditableCell.css';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

export const EditableFormRow = Form.create()(EditableRow);

const getValuePropName = type => {
    switch (type) {
        case 'checkbox':
            return 'checked';
        case 'text':
        default:
            return 'value';
    }
}

const getInputFromType = (type, ref, save) => {
    switch (type) {
        case 'checkbox':
            return <Checkbox
                ref={ref}
                onPressEnter={save}
                onBlur={save} />;
        case 'text':
        default:
            return <Input
                ref={ref}
                onPressEnter={save}
                onBlur={save} />;
    }
}

export class EditableCell extends React.Component {
    state = {
        editing: false
    }

    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.inputRef.current.focus();
            }
        });
    }

    save = (e) => {
        const { record, onSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }

            this.toggleEdit();
            onSave({ ...record, ...values });
        });
    }

    render() {
        const {
            type,
            editable,
            dataIndex,
            title,
            record,
            index,
            onSave,
            ...restProps
        } = this.props;

        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;

                            return (
                                this.state.editing ? (
                                    <FormItem style={{ margin: 0 }}>
                                        {form.getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true,
                                                message: `"${title}" is required.`,
                                            }],
                                            valuePropName: getValuePropName(type),
                                            initialValue: record[dataIndex],
                                        })(getInputFromType(type, this.inputRef, this.save))}
                                    </FormItem>
                                ) : (
                                        <div
                                            className="editable-cell-value-wrap"
                                            style={{ paddingRight: 24 }}
                                            onClick={this.toggleEdit}>
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
}