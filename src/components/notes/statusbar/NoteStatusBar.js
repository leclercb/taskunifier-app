import React from 'react';
import { useNoteApi } from 'hooks/UseNoteApi';
import 'components/notes/statusbar/NoteStatusBar.css';

function NoteStatusBar() {
    const noteApi = useNoteApi();

    const createStatsElement = (title, stats) => (
        <React.Fragment>
            <div className="note-status-bar-element">
                <strong>{title}</strong>
                <span> - </span>
                <strong>#</strong>
                <span> Total: </span>
                <strong>{stats.nbTotal}</strong>
            </div>
        </React.Fragment>
    );

    return (
        <div className="note-status-bar">
            {createStatsElement('All', noteApi.statistics.notes)}
            {createStatsElement('Selected Filter', noteApi.statistics.filteredNotes)}
        </div>
    );
}

export default NoteStatusBar; 