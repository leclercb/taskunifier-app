import PropTypes from 'prop-types';

export const TaskFilterPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string,
    condition: PropTypes.object
});