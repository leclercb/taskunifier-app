import PropTypes from 'prop-types';

export const conditionGroup = {
    id: PropTypes.string.isRequired,
    operator: PropTypes.oneOf(['AND', 'OR', 'NOT']).isRequired
};

export const conditionLeaf = {
    id: PropTypes.string.isRequired
};

export const condition = PropTypes.oneOfType([
    PropTypes.shape(conditionGroup).isRequired,
    PropTypes.shape(conditionLeaf).isRequired
]);

conditionGroup.conditions = PropTypes.arrayOf(condition.isRequired).isRequired;