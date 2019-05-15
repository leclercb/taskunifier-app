import React from 'react';
import PropTypes from 'prop-types';
import { SortDirectionPropType } from 'proptypes/SortDirectionPropTypes';
import withSortDirection from 'containers/WithSortDirection';
import Icon from 'components/common/Icon';

export function SortDirectionTitle(props) {
    const sortDirection = props.sortDirection;
    return sortDirection ? (
        <Icon icon="circle" color={sortDirection.color} text={sortDirection.title} />
    ) : (<span>&nbsp;</span>);
}

SortDirectionTitle.propTypes = {
    sortDirectionId: PropTypes.string,
    sortDirection: SortDirectionPropType
};

export default withSortDirection(SortDirectionTitle);