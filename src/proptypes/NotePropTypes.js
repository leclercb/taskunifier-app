import PropTypes from 'prop-types';

export const NotePropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string,
    star: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.string.isRequired),
    folder: PropTypes.string
});