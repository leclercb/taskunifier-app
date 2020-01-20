import PropTypes from 'prop-types';

export const ProcessPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    notify: PropTypes.bool,
    error: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string.isRequired)
    ])
});