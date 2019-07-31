import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { getContextFields } from 'data/DataContextFields';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { ContextPropType } from 'proptypes/ContextPropTypes';
import { getDefaultFormItemLayout, onCommitForm } from 'utils/FormUtils';

function ContextForm(props) {
    const fields = getContextFields();

    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    return (
        <Form {...formItemLayout}>
            {fields.filter(field => field.visible !== false).map(field => (
                <Form.Item key={field.id} label={field.title}>
                    {getFieldDecorator(field.id, {
                        valuePropName: getValuePropNameForType(field.type),
                        initialValue: props.context[field.id]
                    })(
                        getInputForType(
                            field.type,
                            field.options,
                            {
                                onCommit: () => onCommitForm(props.form, props.context, props.updateContext)
                            })
                    )}
                </Form.Item>
            ))}
        </Form>
    );
}

ContextForm.propTypes = {
    form: PropTypes.object.isRequired,
    context: ContextPropType.isRequired,
    updateContext: PropTypes.func.isRequired
};

export default Form.create({ name: 'context' })(ContextForm);