import PropTypes from 'prop-types';

export const SortDirectionPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string
});