import React from 'react';
import PropTypes from 'prop-types';
import SplitPane from 'react-split-pane';
import TaskSider from 'components/tasks/sider/TaskSider';
import TaskGrid from 'components/tasks/grid/TaskGridVirtualized';
import withSettings from 'containers/WithSettings';
import TaskQuickAdd from 'components/tasks/quick/TaskQuickAdd';
import TaskTabs from 'components/tasks/tabs/TaskTabs';

function TaskView(props) {
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
            <TaskSider />
            <SplitPane
                split="horizontal"
                minSize={200}
                defaultSize={props.settings.horizontalSplitPaneSize}
                onChange={size => onHorizontalSplitPaneSizeChange(size)}
                primary="second"
                paneStyle={{ overflowY: 'auto' }}>
                <div style={{ height: '100%' }}>
                    <TaskQuickAdd />
                    <TaskGrid />
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
};

export default withSettings(TaskView);