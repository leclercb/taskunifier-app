import React, { useEffect } from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte';
import { TaskPropType } from 'proptypes/TaskPropTypes';

function TaskTextForm(props) {
    const createValue = () => {
        const text = props.task.text || '';

        if (text && !text.match(/<(br|p|strong|b|em|i)\s*\/?>/)) {
            return RichTextEditor.createValueFromString(text, 'markdown');
        }

        return RichTextEditor.createValueFromString(text, 'html');
    };

    const [value, setValue] = React.useState(createValue());

    const editorRef = React.createRef();

    useEffect(() => {
        setValue(createValue());
    }, [props.task.text]); // eslint-disable-line react-hooks/exhaustive-deps

    const onSave = () => {
        const element = editorRef.current;

        setTimeout(() => {
            if (!element || !element.contains(document.activeElement)) {
                props.updateTask({
                    ...props.task,
                    text: value.toString('html')
                });
            }
        });
    };

    const spinning = process.env.REACT_APP_MODE === 'react' && !('text' in props.task);

    return (
        <div ref={editorRef} style={{ height: '100%' }}>
            <Spin spinning={spinning}>
                <RichTextEditor
                    value={value}
                    onChange={setValue}
                    onBlur={onSave}
                    rootStyle={{ height: '100%' }}
                    editorClassName="rte-editor" />
            </Spin>
        </div>
    );
}

TaskTextForm.propTypes = {
    task: TaskPropType.isRequired,
    updateTask: PropTypes.func.isRequired
};

export default TaskTextForm;