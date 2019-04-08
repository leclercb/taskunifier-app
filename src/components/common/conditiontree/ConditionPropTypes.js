import PropTypes from 'prop-types';

export const conditionGroup = {
    '@uuid': PropTypes.string.isRequired,
    operator: PropTypes.oneOf(['AND', 'OR', 'NOT']).isRequired
};

export const conditionLeaf = {
    '@uuid': PropTypes.string.isRequired
};

export const condition = PropTypes.oneOfType([
    PropTypes.shape(conditionGroup).isRequired,
    PropTypes.shape(conditionLeaf).isRequired
]);

conditionGroup.conditions = PropTypes.arrayOf(condition).isRequired;
