import React, { forwardRef } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useContextApi } from 'hooks/UseContextApi';

const ContextSelect = forwardRef(function ContextSelect(props, ref) {
    const contextApi = useContextApi();
    const value = contextApi.contexts.find(context => context.id === props.value) ? props.value : undefined;

    return (
        <Select
            ref={ref}
            allowClear={true}
            showSearch={true}
            filterOption={(input, option) => (option.props.title || '').toLowerCase().includes(input)}
            {...props}
            value={value}>
            {contextApi.contexts.map(context => (
                <Select.Option key={context.id} value={context.id} title={context.title}>
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