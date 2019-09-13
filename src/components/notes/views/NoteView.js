import React from 'react';
import SplitPane from 'react-split-pane';
import NoteSider from 'components/notes/sider/NoteSider';
import NoteTable from 'components/notes/table/NoteTable';
import NoteTabs from 'components/notes/tabs/NoteTabs';
import { useSettingsApi } from 'hooks/UseSettingsApi';

function NoteView() {
    const settingsApi = useSettingsApi();

    const onNoteViewSplitPaneSizeChange = size => {
        settingsApi.updateSettings({ noteViewSplitPaneSize: size });
        window.dispatchEvent(new Event('app-resize'));
    };

    const onNoteViewSubSplitPaneSizeChange = size => {
        settingsApi.updateSettings({ noteViewSubSplitPaneSize: size });
        window.dispatchEvent(new Event('app-resize'));
    };

    return (
        <SplitPane
            split="vertical"
            minSize={200}
            defaultSize={settingsApi.settings.noteViewSplitPaneSize}
            onDragFinished={size => onNoteViewSplitPaneSizeChange(size)}
            paneStyle={{ overflowY: 'auto' }}>
            <NoteSider />
            <SplitPane
                split={settingsApi.settings.noteViewSubSplitPaneMode}
                minSize={200}
                defaultSize={settingsApi.settings.noteViewSubSplitPaneSize}
                onDragFinished={size => onNoteViewSubSplitPaneSizeChange(size)}
                primary="second"
                paneStyle={{ overflowY: 'auto' }}>
                <div style={{ height: '100%' }}>
                    <NoteTable />
                </div>
                <div style={{ padding: 10, width: '100%', height: '100%' }}>
                    <NoteTabs />
                </div>
            </SplitPane>
        </SplitPane>
    );
}

export default NoteView;