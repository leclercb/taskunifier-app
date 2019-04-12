import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Row, Col } from 'antd';
import withFields from '../../containers/WithFields';
import { FieldPropType } from '../../proptypes/FieldPropTypes';
import { getInputForType, getSelectForType } from '../../utils/FieldUtils';

function FilterConditionForm(props) {
    const { getFieldDecorator } = props.form;

    const onSave = () => {
        return new Promise((resolve, reject) => {
            props.form.validateFieldsAndScroll((err, values) => {
                if (err) {
                    reject(err);
                } else {
                    const v = { ...values };
                    delete v.title;

                    Object.assign(props.condition, v);
                    props.handleUpdate(props.condition);

                    resolve(v);
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
            xs: { span: 0 },
            sm: { span: 0 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 24 }
        }
    };

    const field = props.fields.find(field => field.id === props.condition.field);

    return (
        <Form {...formItemLayout}>
            <Row gutter={10}>
                <Col span={6}>
                    <Form.Item >
                        {getFieldDecorator('title', {
                            initialValue: field.title
                        })(
                            <Input disabled={true} />
                        )}
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item>
                        {getFieldDecorator('type', {
                            initialValue: props.condition.type,
                            rules: [
                                {
                                    required: true, message: 'The condition is required',
                                }
                            ]
                        })(
                            getSelectForType(field.type)
                        )}
                    </Form.Item>
                </Col>
                <Col span={10}>
                    <Form.Item>
                        {getFieldDecorator('value', {
                            initialValue: props.condition.value,
                            rules: [
                                {
                                    required: true, message: 'The value is required',
                                }
                            ]
                        })(
                            getInputForType(field.type)
                        )}
                    </Form.Item>
                </Col>
            </Row>
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
};

export default withFields(Form.create({ name: 'condition' })(FilterConditionForm));