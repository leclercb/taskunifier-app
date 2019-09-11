import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icon from 'components/common/Icon';
import { getVisibleContext } from 'selectors/ContextSelectors';

export function ContextTitle(props) {
    const context = useSelector(getVisibleContext(props.contextId));
    return context ? <Icon icon="circle" color={context.color} text={context.title} /> : <span>&nbsp;</span>;
}

ContextTitle.propTypes = {
    contextId: PropTypes.string
};

export default ContextTitle;