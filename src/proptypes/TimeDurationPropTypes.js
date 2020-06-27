import PropTypes from 'prop-types';

export const TimeDurationPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    amount: PropTypes.number,
    unit: PropTypes.string
});