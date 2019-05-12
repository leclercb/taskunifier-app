import React from 'react';
import PropTypes from 'prop-types';
import SplitPane from 'react-split-pane';
import NoteSider from 'components/notes/sider/NoteSider';
import NoteTable from 'components/notes/table/NoteTable';
import withSettings from 'containers/WithSettings';
import NoteTabs from 'components/notes/tabs/NoteTabs';

function NoteView(props) {
    const onNoteViewSplitPaneSizeChange = size => {
        props.updateSettings({ noteViewSplitPaneSize: size });
        window.dispatchEvent(new Event('app-resize'));
    };

    const onNoteViewSubSplitPaneSizeChange = size => {
        props.updateSettings({ noteViewSubSplitPaneSize: size });
        window.dispatchEvent(new Event('app-resize'));
    };

    return (
        <SplitPane
            split="vertical"
            minSize={200}
            defaultSize={props.settings.noteViewSplitPaneSize}
            onChange={size => onNoteViewSplitPaneSizeChange(size)}
            paneStyle={{ overflowY: 'auto' }}>
            <NoteSider />
            <SplitPane
                split={props.settings.noteViewSubSplitPaneMode}
                minSize={200}
                defaultSize={props.settings.noteViewSubSplitPaneSize}
                onChange={size => onNoteViewSubSplitPaneSizeChange(size)}
                primary="second"
                paneStyle={{ overflowY: 'auto' }}>
                <div style={{ height: '100%' }}>
                    <NoteTable />
                </div>
                <div style={{ padding: 10, width: '100%' }}>
                    <NoteTabs />
                </div>
            </SplitPane>
        </SplitPane>
    );
}

NoteView.propTypes = {
    settings: PropTypes.object.isRequired,
    updateSettings: PropTypes.func.isRequired
};

export default withSettings(NoteView);