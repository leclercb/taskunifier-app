import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import withTaskField from 'containers/WithTaskField';
import { FieldPropType } from 'proptypes/FieldPropTypes';

export function TaskFieldTitle(props) {
    const { taskField } = props;
    return taskField ? <Icon icon="circle" color={taskField.color} text={taskField.title} /> : <span>&nbsp;</span>;
}

TaskFieldTitle.propTypes = {
    taskFieldId: PropTypes.string,
    taskField: FieldPropType
};

export default withTaskField(TaskFieldTitle);