import PropTypes from 'prop-types';

export const TaskTemplatePropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string,
    properties: PropTypes.object
});