import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { PriorityPropType } from '../../proptypes/PriorityPropTypes';
import withPriorities from '../../containers/WithPriorities';
import withSettings from '../../containers/WithSettings';
import Icon from '../common/Icon';
import { getPriorityColor } from '../../utils/SettingUtils';

function PrioritySelect(props) {
    const { priorities, ...restProps } = props;

    return (
        <Select allowClear={true} {...restProps}>
            {priorities.map(priority => (
                <Select.Option key={priority.id} value={priority.id}>
                    <Icon icon="circle" color={getPriorityColor(priority.id, props.settings)} text={priority.title} />
                </Select.Option>
            ))}
        </Select>
    );
}

PrioritySelect.propTypes = {
    priorities: PropTypes.arrayOf(PriorityPropType).isRequired
};

export default withPriorities(withSettings(PrioritySelect));