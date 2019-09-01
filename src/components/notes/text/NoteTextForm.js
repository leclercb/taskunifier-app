import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte';
import { NotePropType } from 'proptypes/NotePropTypes';

function NoteTextForm(props) {
    const [value, setValue] = React.useState(RichTextEditor.createValueFromString(props.note.text || '', 'markdown'));

    const editorRef = React.createRef();

    useEffect(() => {
        setValue(RichTextEditor.createValueFromString(props.note.text || '', 'markdown'));
    }, [props.note.text]);

    const onSave = () => {
        const element = editorRef.current;

        setTimeout(() => {
            if (!element || !element.contains(document.activeElement)) {
                props.updateNote({
                    ...props.note,
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

NoteTextForm.propTypes = {
    note: NotePropType.isRequired,
    updateNote: PropTypes.func.isRequired
};

export default NoteTextForm;