import PropTypes from 'prop-types';

export const LocationPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string,
    description: PropTypes.string,
    latitude: PropTypes.string,
    longitude: PropTypes.string
});