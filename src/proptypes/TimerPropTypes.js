import PropTypes from 'prop-types';

export const TimerPropType = PropTypes.shape({
    value: PropTypes.number.isRequired,
    startDate: PropTypes.string
});