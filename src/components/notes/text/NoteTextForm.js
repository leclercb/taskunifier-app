import React from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import RichTextField from 'components/common/RichTextField';
import { NotePropType } from 'proptypes/NotePropTypes';

function NoteTextForm(props) {
    const onChange = value => {
        props.updateNote({
            ...props.note,
            text: value
        });
    };

    const spinning = process.env.REACT_APP_MODE === 'react' && !('text' in props.note);

    return (
        <Spin spinning={spinning}>
            <RichTextField value={props.note.text} onChange={onChange} />
        </Spin>
    );
}

NoteTextForm.propTypes = {
    note: NotePropType.isRequired,
    updateNote: PropTypes.func.isRequired
};

export default NoteTextForm;