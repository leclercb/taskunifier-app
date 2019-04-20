import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { TaskPropType } from '../../../proptypes/TaskPropTypes';

function TaskNoteForm(props) {
    return (
        <Input.TextArea
            style={{ width: '100%' }}
            autosize={{
                minRows: 5
            }}
            value={props.task.note}
            onChange={e => props.updateTask({ ...props.task, note: e.target.value })} />
    );
}

TaskNoteForm.propTypes = {
    task: TaskPropType.isRequired,
    updateTask: PropTypes.func.isRequired
};

export default TaskNoteForm;