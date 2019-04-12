import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import ColorPicker from 'rc-color-picker';
import { FilterPropType } from '../../proptypes/FilterPropTypes';
import { merge } from '../../utils/ObjectUtils';
import Icon from '../common/Icon';
import { getDefaultFormItemLayout, getDefaultTailFormItemLayout } from '../../utils/FormUtils';

function FilterForm(props) {
    const onSave = (e) => {
        e.preventDefault();
        props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const updatedFilter = merge({ ...props.filter }, values);
                props.updateFilter(updatedFilter);
            }
        });
    }

    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();
    const tailFormItemLayout = getDefaultTailFormItemLayout();

    return (
        <Form {...formItemLayout} onSubmit={onSave}>
            <Form.Item label="Title">
                {getFieldDecorator('title', {
                    initialValue: props.filter.title,
                    rules: [
                        {
                            required: true,
                            message: 'The title is required',
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
                    getValueFromEvent: event => event.color,
                    rules: [
                        {
                            required: true, message: 'The color is required',
                        }
                    ]
                })(
                    <ColorPicker />
                )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                    <Icon icon="save" color="#ffffff" text="Save" />
                </Button>
            </Form.Item>
        </Form>
    );
}

FilterForm.propTypes = {
    filter: FilterPropType.isRequired,
    updateFilter: PropTypes.func.isRequired
};

export default Form.create({ name: 'filter' })(FilterForm);