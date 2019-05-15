import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import withPriorities from 'containers/WithPriorities';
import withSettings from 'containers/WithSettings';
import Icon from 'components/common/Icon';
import { PriorityPropType } from 'proptypes/PriorityPropTypes';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { getPriorityColor } from 'utils/SettingUtils';

const PrioritySelect = React.forwardRef(function PrioritySelect(props, ref) {
    const { priorities, ...restProps } = props;

    return (
        <Select ref={ref} allowClear={true} {...restProps}>
            {priorities.map(priority => (
                <Select.Option key={priority.id} value={priority.id}>
                    <Icon icon="circle" color={getPriorityColor(priority.id, props.settings)} text={priority.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

PrioritySelect.propTypes = {
    priorities: PropTypes.arrayOf(PriorityPropType.isRequired).isRequired,
    settings: SettingsPropType.isRequired
};

export default withPriorities(withSettings(PrioritySelect));