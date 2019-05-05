import PropTypes from 'prop-types';

export const LinkedTaskPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    links: PropTypes.arrayOf(PropTypes.string.isRequired),
    task: PropTypes.string
});