import PropTypes from 'prop-types';

export const LinkedContactPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    link: PropTypes.string,
    contact: PropTypes.string
});