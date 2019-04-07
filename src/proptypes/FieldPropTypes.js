import PropTypes from 'prop-types';

export const FolderPropType = {
    id: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'checkbox']).isRequired,
    base: PropTypes.bool.isRequired
};