import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import withTaskFields from 'containers/WithTaskFields';
import { FieldPropType } from 'proptypes/FieldPropTypes';

export const TaskFieldSelect = React.forwardRef(function TaskFieldSelect(props, ref) {
    const { taskFields, ...restProps } = props;

    restProps.value = taskFields.find(taskField => taskField.id === restProps.value) ? restProps.value : null;

    return (
        <Select ref={ref} allowClear={true} {...restProps}>
            {taskFields.map(field => (
                <Select.Option key={field.id} value={field.id}>
                    <Icon icon="circle" color={field.color} text={field.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

TaskFieldSelect.propTypes = {
    taskFields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired
};

export default withTaskFields(TaskFieldSelect);