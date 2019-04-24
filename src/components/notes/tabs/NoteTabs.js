import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Empty } from 'antd';
import withSelectedNotes from 'containers/WithSelectedNotes';
import NoteNoteForm from 'components/notes/note/NoteNoteForm';

function NoteTabs(props) {
    if (props.selectedNotes.length !== 1) {
        return (
            <Empty description="Please select one note" />
        );
    }

    return (
        <Tabs animated={false} style={{ height: '100%' }}>
            <Tabs.TabPane tab="Note" key="note" style={{ height: '100%' }}>
                <NoteNoteForm note={props.selectedNotes[0]} updateNote={props.updateNote} />
            </Tabs.TabPane>
        </Tabs>
    );
}

NoteTabs.propTypes = {
    selectedNotes: PropTypes.array.isRequired,
    setSelectedNoteIds: PropTypes.func.isRequired
};

export default withSelectedNotes(NoteTabs);