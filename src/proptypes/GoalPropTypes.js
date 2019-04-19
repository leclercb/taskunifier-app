import PropTypes from 'prop-types';

export const GoalPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string,
    level: PropTypes.string,
    contributesTo: PropTypes.string,
    archived: PropTypes.bool
});