import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte';
import { TaskPropType } from 'proptypes/TaskPropTypes';

function TaskTextForm(props) {
    const [value, setValue] = React.useState(RichTextEditor.createValueFromString(props.task.text || '', 'markdown'));

    const editorRef = React.createRef();

    useEffect(() => {
        setValue(RichTextEditor.createValueFromString(props.task.text || '', 'markdown'));
    }, [props.task.text]);

    const onSave = () => {
        const element = editorRef.current;

        setTimeout(() => {
            if (!element || !element.contains(document.activeElement)) {
                props.updateTask({
                    ...props.task,
                    text: value.toString('markdown')
                });
            }
        });
    };

    return (
        <div ref={editorRef} style={{ height: '100%' }}>
            <RichTextEditor
                value={value}
                onChange={setValue}
                onBlur={onSave}
                rootStyle={{ height: '100%' }}
                editorClassName="rte-editor" />
        </div>
    );
}

TaskTextForm.propTypes = {
    task: TaskPropType.isRequired,
    updateTask: PropTypes.func.isRequired
};

export default TaskTextForm;