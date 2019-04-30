import PropTypes from 'prop-types';

export const LinkedContactPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    links: PropTypes.arrayOf(PropTypes.string),
    contact: PropTypes.string
});