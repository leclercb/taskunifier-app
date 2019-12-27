import React from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import RichTextField from 'components/common/RichTextField';
import { TaskPropType } from 'proptypes/TaskPropTypes';

function TaskTextForm(props) {
    const onChange = value => {
        props.updateTask({
            ...props.task,
            text: value
        });
    };

    const spinning = process.env.REACT_APP_MODE === 'react' && !('text' in props.task);

    return (
        <Spin spinning={spinning}>
            <RichTextField value={props.task.text} onChange={onChange} />
        </Spin>
    );
}

TaskTextForm.propTypes = {
    task: TaskPropType.isRequired,
    updateTask: PropTypes.func.isRequired
};

export default TaskTextForm;