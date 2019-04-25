import PropTypes from 'prop-types';
import { getFieldTypes } from 'data/DataFieldConfigurations';

export const FieldPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string,
    type: PropTypes.oneOf(getFieldTypes()).isRequired
});