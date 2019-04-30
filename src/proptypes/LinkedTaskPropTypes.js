import PropTypes from 'prop-types';

export const LinkedTaskPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    link: PropTypes.string,
    task: PropTypes.string
});