import React from 'react';
import PropTypes from 'prop-types';
import SplitPane from 'react-split-pane';
import NoteSider from 'components/notes/sider/NoteSider';
import NoteTable from 'components/notes/table/NoteTable';
import withSettings from 'containers/WithSettings';
import NoteTabs from 'components/notes/tabs/NoteTabs';

function NoteView(props) {
    const onVerticalSplitPaneSizeChange = size => {
        props.updateSettings({ verticalSplitPaneSize: size });
        window.dispatchEvent(new Event('app-resize'));
    };

    const onHorizontalSplitPaneSizeChange = size => {
        props.updateSettings({ horizontalSplitPaneSize: size });
        window.dispatchEvent(new Event('app-resize'));
    };

    return (
        <SplitPane
            split="vertical"
            minSize={200}
            defaultSize={props.settings.verticalSplitPaneSize}
            onChange={size => onVerticalSplitPaneSizeChange(size)}
            paneStyle={{ overflowY: 'auto' }}>
            <NoteSider />
            <SplitPane
                split="horizontal"
                minSize={200}
                defaultSize={props.settings.horizontalSplitPaneSize}
                onChange={size => onHorizontalSplitPaneSizeChange(size)}
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