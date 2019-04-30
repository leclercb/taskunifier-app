import PropTypes from 'prop-types';

export const LinkedFilePropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    link: PropTypes.string,
    file: PropTypes.string
});