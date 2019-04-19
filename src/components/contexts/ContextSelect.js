import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { ContextPropType } from '../../proptypes/ContextPropTypes';
import withContexts from '../../containers/WithContexts';
import Icon from '../common/Icon';

function ContextSelect(props) {
    const { contexts, ...restProps } = props;

    restProps.value = props.contexts.find(context => context.id === restProps.value) ? restProps.value : null;

    return (
        <Select allowClear={true} {...restProps}>
            {contexts.map(context => (
                <Select.Option key={context.id} value={context.id}>
                    <Icon icon="circle" color={context.color} text={context.title} />
                </Select.Option>
            ))}
        </Select>
    );
}

ContextSelect.propTypes = {
    contexts: PropTypes.arrayOf(ContextPropType).isRequired
}

export default withContexts(ContextSelect);