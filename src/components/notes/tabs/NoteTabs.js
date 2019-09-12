import React from 'react';
import { Empty, Tabs } from 'antd';
import NoteTextForm from 'components/notes/text/NoteTextForm';
import { useNotes } from 'hooks/UseNotes';
import 'components/notes/tabs/NoteTabs.css';

function NoteTabs() {
    const noteApi = useNotes();

    if (noteApi.selectedNotes.length !== 1) {
        return (
            <Empty description="Please select one note" />
        );
    }

    return (
        <Tabs animated={false} className="ant-tabs-full-height">
            <Tabs.TabPane tab="Text" key="text">
                <NoteTextForm note={noteApi.selectedNotes[0]} updateNote={noteApi.updateNote} />
            </Tabs.TabPane>
        </Tabs>
    );
}

export default NoteTabs;