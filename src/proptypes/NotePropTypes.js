import PropTypes from 'prop-types';

export const NotePropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
});