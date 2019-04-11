import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import withFields from '../../containers/WithFields';
import { FieldPropType } from '../../proptypes/FieldPropTypes';
import { getSelectForType } from '../fields/FieldComponents';

function FilterConditionForm(props) {
    const { getFieldDecorator } = props.form;

    const onSave = () => {
        return new Promise((resolve, reject) => {
            props.form.validateFieldsAndScroll((err, values) => {
                if (err) {
                    reject(err);
                } else {
                    Object.assign(props.condition, values);
                    props.handleUpdate(props.condition);
                    resolve(values);
                }
            });
        });
    }
    useEffect(() => {
        props.handleAddSaveCallback(props.condition.id, onSave);
        return () => props.handleAddSaveCallback(props.condition.id, null);
    });

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        }
    };

    const field = props.fields.find(field => field.id === props.condition.field);

    return (
        <Form {...formItemLayout}>
            <Form.Item label="Field">
                {field.title}
            </Form.Item>
            <Form.Item label="Condition">
                {getFieldDecorator('condition', {
                    initialValue: props.condition.condition,
                    rules: [
                        {
                            required: true, message: 'The condition is required',
                        }
                    ]
                })(
                    getSelectForType(field.type)
                )}
            </Form.Item>
            <Form.Item label="Value">
                {getFieldDecorator('value', {
                    initialValue: props.condition.value,
                    rules: [
                        {
                            required: true, message: 'The value is required',
                        }
                    ]
                })(
                    <Input />
                )}
            </Form.Item>
        </Form>
    );
}

FilterConditionForm.propTypes = {
    fields: PropTypes.arrayOf(FieldPropType),
    condition: PropTypes.object.isRequired,
    context: PropTypes.object,
    disabled: PropTypes.bool.isRequired,
    handleAddSaveCallback: PropTypes.func.isRequired,
    handleUpdate: PropTypes.func.isRequired
}

export default withFields(Form.create({ name: 'condition' })(FilterConditionForm));