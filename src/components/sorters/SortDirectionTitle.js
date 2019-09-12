import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useSortDirections } from 'hooks/UseSortDirections';

export function SortDirectionTitle(props) {
    const sortDirectionApi = useSortDirections();
    const sortDirection = sortDirectionApi.sortDirections.find(sortDirection => sortDirection.id === props.sortDirectionId);

    return sortDirection ? (
        <Icon icon="circle" color={sortDirection.color} text={sortDirection.title} />
    ) : (<span>&nbsp;</span>);
}

SortDirectionTitle.propTypes = {
    sortDirectionId: PropTypes.string
};

export default SortDirectionTitle;