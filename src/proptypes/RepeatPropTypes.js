import PropTypes from 'prop-types';

export const RepeatPropType = PropTypes.shape({
    type: PropTypes.string.isRequired,
    dayOfWeek: PropTypes.string,
    dayNb: PropTypes.number,
    daysOfWeek: PropTypes.arrayOf(PropTypes.string.isRequired),
    nbDays: PropTypes.number,
    nbMonths: PropTypes.number,
    nbWeeks: PropTypes.number,
    nbYears: PropTypes.number,
    weekNb: PropTypes.string
});