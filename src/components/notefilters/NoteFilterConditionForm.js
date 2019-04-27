import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, Input, Row } from 'antd';
import withNoteFields from 'containers/WithNoteFields';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import {
    getInputForType,
    getNormalizeForType,
    getSelectForType,
    getValueFromEventForType,
    getValuePropNameForType
} from 'utils/FieldUtils';
import { onFieldChangeForObjectUpdates } from 'utils/FormUtils';

function NoteFilterConditionForm(props) {
    const { getFieldDecorator } = props.form;

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

    const field = props.noteFields.find(field => field.id === props.condition.field);

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
                                    required: true, 
                                    message: 'The condition is required',
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
                            rules: [],
                            valuePropName: getValuePropNameForType(field.type),
                            getValueFromEvent: getValueFromEventForType(field.type),
                            initialValue: getNormalizeForType(field.type)(props.condition.value)
                        })(
                            getInputForType(field.type, field.options)
                        )}
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}

NoteFilterConditionForm.propTypes = {
    form: PropTypes.object.isRequired,
    noteFields: PropTypes.arrayOf(FieldPropType),
    condition: PropTypes.object.isRequired,
    context: PropTypes.object,
    disabled: PropTypes.bool.isRequired,
    onUpdate: PropTypes.func.isRequired
};

export default withNoteFields(Form.create({
    name: 'condition',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.condition, props.onUpdate, true)
})(NoteFilterConditionForm));