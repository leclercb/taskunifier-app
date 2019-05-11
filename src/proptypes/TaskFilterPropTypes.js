import PropTypes from 'prop-types';
import { SorterPropType } from 'proptypes/SorterPropTypes';

export const TaskFilterPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string,
    condition: PropTypes.object,
    sorters: PropTypes.arrayOf(SorterPropType.isRequired)
});