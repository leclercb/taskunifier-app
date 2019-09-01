import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte';
import { NotePropType } from 'proptypes/NotePropTypes';

function NoteTextForm(props) {
    const [value, setValue] = React.useState(RichTextEditor.createValueFromString(props.note.text || '', 'markdown'));

    useEffect(() => {
        setValue(RichTextEditor.createValueFromString(props.note.text || '', 'markdown'));
    }, [props.note.text]);

    const onSave = () => {
        props.updateNote({
            ...props.note,
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

NoteTextForm.propTypes = {
    note: NotePropType.isRequired,
    updateNote: PropTypes.func.isRequired
};

export default NoteTextForm;