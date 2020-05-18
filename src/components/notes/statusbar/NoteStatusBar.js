import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import withBusyCheck from 'containers/WithBusyCheck';
import { useAppApi } from 'hooks/UseAppApi';
import { useNoteApi } from 'hooks/UseNoteApi';
import 'components/notes/statusbar/NoteStatusBar.css';

function NoteStatusBar({ apis }) {
    const { appApi, noteApi } = apis;

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
            <div className="note-status-bar-element">
                <Icon icon="cog" onClick={() => appApi.setSettingManagerOptions({ visible: true, category: 'statusBar' })} />
            </div>
        </div>
    );
}

NoteStatusBar.propTypes = {
    apis: PropTypes.object.isRequired
};

export default withBusyCheck(NoteStatusBar, () => ({
    appApi: useAppApi(),
    noteApi: useNoteApi()
}));