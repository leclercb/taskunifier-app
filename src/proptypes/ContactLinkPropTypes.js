import PropTypes from 'prop-types';

export const ContactLinkPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    contact: PropTypes.string,
    link: PropTypes.string
});