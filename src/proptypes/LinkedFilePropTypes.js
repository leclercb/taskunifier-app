import PropTypes from 'prop-types';

export const LinkedFilePropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    links: PropTypes.arrayOf(PropTypes.string.isRequired),
    file: PropTypes.string
});