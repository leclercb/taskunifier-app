import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useContext } from 'hooks/UseContext';

export function ContextTitle(props) {
    const context = useContext(props.contextId);
    return context ? <Icon icon="circle" color={context.color} text={context.title} /> : <span>&nbsp;</span>;
}

ContextTitle.propTypes = {
    contextId: PropTypes.string
};

export default ContextTitle;