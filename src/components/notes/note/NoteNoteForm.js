import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { NotePropType } from '../../../proptypes/NotePropTypes';

function NoteNoteForm(props) {
    return (
        <Input.TextArea
            style={{ width: '100%' }}
            autosize={{
                minRows: 5
            }}
            value={props.note.note}
            onChange={e => props.updateNote({ ...props.note, note: e.target.value })} />
    );
}

NoteNoteForm.propTypes = {
    note: NotePropType.isRequired,
    updateNote: PropTypes.func.isRequired
};

export default NoteNoteForm;