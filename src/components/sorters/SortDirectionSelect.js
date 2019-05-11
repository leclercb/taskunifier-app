import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { SortDirectionPropType } from 'proptypes/SortDirectionPropTypes';
import withSortDirections from 'containers/WithSortDirections';
import withSettings from 'containers/WithSettings';
import Icon from 'components/common/Icon';

function SortDirectionSelect(props) {
    const { sortDirections, ...restProps } = props;

    return (
        <Select allowClear={true} {...restProps}>
            {sortDirections.map(sortDirection => (
                <Select.Option key={sortDirection.id} value={sortDirection.id}>
                    <Icon icon="circle" color={sortDirection.color} text={sortDirection.title} />
                </Select.Option>
            ))}
        </Select>
    );
}

SortDirectionSelect.propTypes = {
    sortDirections: PropTypes.arrayOf(SortDirectionPropType.isRequired).isRequired,
    settings: PropTypes.object.isRequired
};

export default withSortDirections(withSettings(SortDirectionSelect));