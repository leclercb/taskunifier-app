import PropTypes from 'prop-types';

export const TaskPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
});