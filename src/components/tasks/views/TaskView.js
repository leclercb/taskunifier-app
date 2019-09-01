import React from 'react';
import PropTypes from 'prop-types';
import SplitPane from 'react-split-pane';
import TaskSider from 'components/tasks/sider/TaskSider';
import TaskTable from 'components/tasks/table/TaskTable';
import withSettings from 'containers/WithSettings';
import TaskQuickAdd from 'components/tasks/quick/TaskQuickAdd';
import TaskTabs from 'components/tasks/tabs/TaskTabs';

function TaskView(props) {
    const onTaskViewSplitPaneSizeChange = size => {
        props.updateSettings({ taskViewSplitPaneSize: size });
        window.dispatchEvent(new Event('app-resize'));
    };

    const onTaskViewSubSplitPaneSizeChange = size => {
        props.updateSettings({ taskViewSubSplitPaneSize: size });
        window.dispatchEvent(new Event('app-resize'));
    };

    return (
        <SplitPane
            split="vertical"
            minSize={200}
            defaultSize={props.settings.taskViewSplitPaneSize}
            onDragFinished={size => onTaskViewSplitPaneSizeChange(size)}
            paneStyle={{ overflowY: 'auto' }}>
            <TaskSider mode="table" />
            <SplitPane
                split={props.settings.taskViewSubSplitPaneMode}
                minSize={200}
                defaultSize={props.settings.taskViewSubSplitPaneSize}
                onDragFinished={size => onTaskViewSubSplitPaneSizeChange(size)}
                primary="second"
                paneStyle={{ overflowY: 'auto' }}>
                <div style={{ height: '100%' }}>
                    <TaskQuickAdd />
                    <TaskTable />
                </div>
                <div style={{ padding: 10, width: '100%', height: '100%' }}>
                    <TaskTabs />
                </div>
            </SplitPane>
        </SplitPane>
    );
}

TaskView.propTypes = {
    settings: PropTypes.shape({
        taskViewSplitPaneSize: PropTypes.number.isRequired,
        taskViewSubSplitPaneMode: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
        taskViewSubSplitPaneSize: PropTypes.number.isRequired
    }).isRequired,
    updateSettings: PropTypes.func.isRequired
};

export default withSettings(TaskView);