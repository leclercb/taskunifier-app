import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useContextApi } from 'hooks/UseContextApi';

export const ContextSelect = React.forwardRef(function ContextSelect(props, ref) {
    const contextApi = useContextApi();
    const value = contextApi.contexts.find(context => context.id === props.value) ? props.value : null;

    return (
        <Select ref={ref} allowClear={true} {...props} value={value}>
            {contextApi.contexts.map(context => (
                <Select.Option key={context.id} value={context.id}>
                    <Icon icon="circle" color={context.color} text={context.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

ContextSelect.displayName = 'ForwardRefContextSelect';

ContextSelect.propTypes = {
    value: PropTypes.string
};

export default ContextSelect;