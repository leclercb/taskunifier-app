import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import ColorPicker from 'components/common/ColorPicker';
import { FilterPropType } from 'proptypes/FilterPropTypes';
import { getDefaultFormItemLayout, onCommitForm } from 'utils/FormUtils';

function FilterForm(props) {
    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    const onCommit = () => onCommitForm(props.form, props.filter, props.updateFilter);

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
                    <Input onBlur={onCommit} />
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
                    <ColorPicker onClose={onCommit} />
                )}
            </Form.Item>
        </Form>
    );
}

FilterForm.propTypes = {
    form: PropTypes.object.isRequired,
    filter: FilterPropType.isRequired,
    updateFilter: PropTypes.func.isRequired
};

export default Form.create({ name: 'filter' })(FilterForm);