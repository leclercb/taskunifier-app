import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import ColorPicker from 'components/common/ColorPicker';
import { FilterPropType } from 'proptypes/FilterPropTypes';
import { getDefaultFormItemLayout, onFieldChangeForObjectUpdates } from 'utils/FormUtils';

function FilterForm(props) {
    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    return (
        <Form {...formItemLayout}>
            <Form.Item label="Title">
                {getFieldDecorator('title', {
                    initialValue: props.filter.title,
                    rules: [
                        {
                            required: true,
                            message: 'The title is required'
                        }
                    ]
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="Color">
                {getFieldDecorator('color', {
                    initialValue: props.filter.color,
                    valuePropName: 'color',
                    rules: [
                        {
                            required: true,
                            message: 'The color is required'
                        }
                    ]
                })(
                    <ColorPicker />
                )}
            </Form.Item>
            {props.extraFields ? props.extraFields(props, getFieldDecorator) : null}
        </Form>
    );
}

FilterForm.propTypes = {
    form: PropTypes.object.isRequired,
    filter: FilterPropType.isRequired,
    updateFilter: PropTypes.func.isRequired,
    extraField: PropTypes.func
};

export default Form.create({
    name: 'filter',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.filter, props.updateFilter)
})(FilterForm);