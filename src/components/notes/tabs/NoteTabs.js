import React from 'react';
import { Empty, Tabs } from 'antd';
import NoteTextForm from 'components/notes/text/NoteTextForm';
import { useNoteApi } from 'hooks/UseNoteApi';
import 'components/notes/tabs/NoteTabs.css';

function NoteTabs() {
    const noteApi = useNoteApi();

    if (noteApi.selectedNotes.length !== 1) {
        return (
            <Empty
                description="Please select one note"
                className="joyride-note-tabs" />
        );
    }

    return (
        <Tabs
            animated={false}
            size="small"
            className="ant-tabs-full-height joyride-note-tabs">
            <Tabs.TabPane tab="Text" key="text">
                <NoteTextForm note={noteApi.selectedNotes[0]} updateNote={noteApi.updateNote} />
            </Tabs.TabPane>
        </Tabs>
    );
}

export default NoteTabs;