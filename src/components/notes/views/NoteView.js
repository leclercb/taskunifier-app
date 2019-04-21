import React from 'react';
import PropTypes from 'prop-types';
import SplitPane from 'react-split-pane';
import NoteSider from '../sider/NoteSider';
import NoteGrid from '../grid/NoteGrid';
import withSettings from '../../../containers/WithSettings';
import NoteTabs from '../tabs/NoteTabs';

function NoteView(props) {
    return (
        <SplitPane
            split="vertical"
            minSize={200}
            defaultSize={props.settings.verticalSplitPaneSize}
            onChange={size => props.updateSettings({ verticalSplitPaneSize: size })}
            paneStyle={{ overflowY: 'auto' }}>
            <NoteSider />
            <SplitPane
                split="horizontal"
                minSize={200}
                defaultSize={props.settings.horizontalSplitPaneSize}
                onChange={size => props.updateSettings({ horizontalSplitPaneSize: size })}
                primary="second"
                paneStyle={{ overflowY: 'auto' }}>
                <div style={{ height: '100%' }}>
                    <div style={{ overflowY: 'auto', height: '100%' }}>
                        <NoteGrid />
                    </div>
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
}

export default withSettings(NoteView);