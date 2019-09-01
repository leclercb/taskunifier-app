import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte';
import { TaskPropType } from 'proptypes/TaskPropTypes';

function TaskTextForm(props) {
    const [value, setValue] = React.useState(RichTextEditor.createValueFromString(props.task.text || '', 'markdown'));

    useEffect(() => {
        setValue(RichTextEditor.createValueFromString(props.task.text || '', 'markdown'));
    }, [props.task.text]);

    const onSave = () => {
        props.updateTask({
            ...props.task,
            text: value.toString('markdown')
        });
    };

    return (
        <RichTextEditor
            value={value}
            onChange={setValue}
            onBlur={onSave}
            editorClassName="rte-editor"
        />
    );
}

TaskTextForm.propTypes = {
    task: TaskPropType.isRequired,
    updateTask: PropTypes.func.isRequired
};

export default TaskTextForm;