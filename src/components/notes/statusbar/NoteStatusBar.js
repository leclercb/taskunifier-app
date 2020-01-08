import React from 'react';
import Icon from 'components/common/Icon';
import { useAppApi } from 'hooks/UseAppApi';
import { useNoteApi } from 'hooks/UseNoteApi';
import 'components/notes/statusbar/NoteStatusBar.css';

function NoteStatusBar() {
    const appApi = useAppApi();
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
            <Icon icon="cog" onClick={() => appApi.setSettingManagerOptions({ visible: true, category: 'statusBar' })} />
        </div>
    );
}

export default NoteStatusBar; 