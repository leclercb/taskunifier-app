import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Col, Form, Input, Row } from 'antd';
import { getInputForType, getSelectForType } from 'data/DataFieldComponents';
import { getConditionsFieldTypeForType } from 'data/DataFieldFilterTypes';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { onCommitForm } from 'utils/FormUtils';

function FilterConditionForm({ condition, context, onUpdate, disabled }) {
    const [form] = Form.useForm();

    const formItemLayout = {
        labelCol: {
            xs: { span: 0 },
            sm: { span: 0 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 24 }
        }
    };

    useEffect(() => {
        form.resetFields();
    }, [condition]); // eslint-disable-line react-hooks/exhaustive-deps

    const field = context.fields.find(field => field.id === condition.field);
    const conditionFieldType = getConditionsFieldTypeForType(field.type);

    const onCommit = () => onCommitForm(form, condition, onUpdate, { assign: true });

    return (
        <Form form={form} initialValues={condition} {...formItemLayout}>
            <Row gutter={10}>
                <Col span={6}>
                    <Form.Item>
                        <Input value={field.title} disabled={true} />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: 'The condition is required'
                            }
                        ]}>
                        {getSelectForType(field.type, {
                            onChange: onCommit,
                            disabled
                        })}
                    </Form.Item>
                </Col>
                <Col span={10}>
                    <Form.Item
                        name="value"
                        valuePropName={getValuePropNameForType(conditionFieldType)}>
                        {getInputForType(
                            conditionFieldType,
                            {
                                ...(field.type === conditionFieldType ? field.options : {}),
                                extended: true
                            },
                            {
                                onCommit,
                                disabled
                            })}
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}

FilterConditionForm.propTypes = {
    condition: PropTypes.object.isRequired,
    context: PropTypes.shape({
        fields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired
    }).isRequired,
    onUpdate: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
};

export default FilterConditionForm;