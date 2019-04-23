import React from 'react';
import PropTypes from 'prop-types';
import SplitPane from 'react-split-pane';
import TaskSider from '../sider/TaskSider';
import TaskGrid from '../grid/TaskGrid';
import withSettings from '../../../containers/WithSettings';
import TaskQuickAdd from '../quick/TaskQuickAdd';
import TaskTabs from '../tabs/TaskTabs';

function TaskView(props) {
    return (
        <SplitPane
            split="vertical"
            minSize={200}
            defaultSize={props.settings.verticalSplitPaneSize}
            onChange={size => props.updateSettings({ verticalSplitPaneSize: size })}
            paneStyle={{ overflowY: 'auto' }}>
            <TaskSider />
            <SplitPane
                split="horizontal"
                minSize={200}
                defaultSize={props.settings.horizontalSplitPaneSize}
                onChange={size => props.updateSettings({ horizontalSplitPaneSize: size })}
                primary="second"
                paneStyle={{ overflowY: 'auto' }}>
                <div style={{ height: '100%' }}>
                    <TaskQuickAdd />
                    <div style={{ overflowY: 'auto', height: 'calc(100% - 40px)' }}>
                        <TaskGrid />
                    </div>
                </div>
                <div style={{ padding: 10, width: '100%' }}>
                    <TaskTabs />
                </div>
            </SplitPane>
        </SplitPane>
    );
}

TaskView.propTypes = {
    settings: PropTypes.object.isRequired,
    updateSettings: PropTypes.func.isRequired
}

export default withSettings(TaskView);