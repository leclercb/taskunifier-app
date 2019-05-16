import React from 'react';
import PropTypes from 'prop-types';
import { ContextPropType } from 'proptypes/ContextPropTypes';
import withContext from 'containers/WithContext';
import Icon from 'components/common/Icon';

export function ContextTitle(props) {
    const { context } = props;
    return context ? <Icon icon="circle" color={context.color} text={context.title} /> : <span>&nbsp;</span>;
}

ContextTitle.propTypes = {
    contextId: PropTypes.string,
    context: ContextPropType
};

export default withContext(ContextTitle);