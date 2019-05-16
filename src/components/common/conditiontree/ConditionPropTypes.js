import PropTypes from 'prop-types';

const ConditionGroupPropTypes = {
    id: PropTypes.string.isRequired,
    operator: PropTypes.oneOf(['AND', 'OR', 'NOT']).isRequired
};

const ConditionLeafPropTypes = {
    id: PropTypes.string.isRequired
};

export const ConditionGroupPropType = PropTypes.shape(ConditionGroupPropTypes);

export const ConditionLeafPropType = PropTypes.shape(ConditionLeafPropTypes);

export const ConditionPropType = PropTypes.oneOfType([
    ConditionGroupPropType.isRequired,
    ConditionLeafPropType.isRequired
]);

ConditionGroupPropTypes.conditions = PropTypes.arrayOf(ConditionPropType.isRequired).isRequired;