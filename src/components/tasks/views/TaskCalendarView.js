import React from 'react';
import PropTypes from 'prop-types';
import SplitPane from 'react-split-pane';
import TaskSider from '../sider/TaskSider';
import TaskCalendar from '../calendar/TaskCalendar';
import withSettings from '../../../containers/WithSettings';
import TaskQuickAdd from '../quick/TaskQuickAdd';
import TaskTabs from '../tabs/TaskTabs';

function TaskCalendarView(props) {
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
                    <div style={{ overflowY: 'auto', height: '100%', backgroundColor: '#ffffff' }}>
                        <TaskCalendar />
                    </div>
                </div>
                <div style={{ padding: 10, width: '100%' }}>
                    <TaskTabs />
                </div>
            </SplitPane>
        </SplitPane>
    );
}

TaskCalendarView.propTypes = {
    settings: PropTypes.object.isRequired,
    updateSettings: PropTypes.func.isRequired
};

export default withSettings(TaskCalendarView);