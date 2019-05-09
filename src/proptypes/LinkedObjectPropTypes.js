import PropTypes from 'prop-types';

export const LinkedObjectPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    links: PropTypes.arrayOf(PropTypes.string.isRequired)
});