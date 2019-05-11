import PropTypes from 'prop-types';

export const SorterPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    field: PropTypes.string,
    direction: PropTypes.string
});