import PropTypes from 'prop-types';
import { getFieldTypes } from '../data/DataFieldConfigurations';

export const FieldPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(getFieldTypes()).isRequired
});