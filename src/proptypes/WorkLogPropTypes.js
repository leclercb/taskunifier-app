import PropTypes from 'prop-types';

export const WorkLogPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    start: PropTypes.string,
    end: PropTypes.string
});