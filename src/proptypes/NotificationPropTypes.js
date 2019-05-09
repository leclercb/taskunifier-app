import PropTypes from 'prop-types';
import { ProcessPropType } from 'proptypes/ProcessPropTypes';

export const NotificationPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    process: ProcessPropType
});