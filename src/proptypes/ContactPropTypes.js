import PropTypes from 'prop-types';

export const ContactPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string,
    color: PropTypes.string
});