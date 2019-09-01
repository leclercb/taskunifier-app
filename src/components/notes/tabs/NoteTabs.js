import React from 'react';
import { Empty, Tabs } from 'antd';
import PropTypes from 'prop-types';
import NoteTextForm from 'components/notes/text/NoteTextForm';
import withSelectedNotes from 'containers/WithSelectedNotes';

function NoteTabs(props) {
    if (props.selectedNotes.length !== 1) {
        return (
            <Empty description="Please select one note" />
        );
    }

    return (
        <Tabs animated={false} style={{ height: '100%' }}>
            <Tabs.TabPane tab="Text" key="text" style={{ height: '100%' }}>
                <NoteTextForm note={props.selectedNotes[0]} updateNote={props.updateNote} />
            </Tabs.TabPane>
        </Tabs>
    );
}

NoteTabs.propTypes = {
    selectedNotes: PropTypes.array.isRequired,
    setSelectedNoteIds: PropTypes.func.isRequired,
    updateNote: PropTypes.func.isRequired
};

export default withSelectedNotes(NoteTabs);