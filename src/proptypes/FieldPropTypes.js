import PropTypes from 'prop-types';
import { getFieldTypes } from 'data/DataFieldTypes';

export const FieldPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string,
    type: PropTypes.oneOf(getFieldTypes()).isRequired,
    editable: PropTypes.bool.isRequired,
    options: PropTypes.object
});