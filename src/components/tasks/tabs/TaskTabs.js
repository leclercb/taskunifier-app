import React from 'react';
import PropTypes from 'prop-types';
import { Empty, Tabs } from 'antd';
import withSelectedTasks from 'containers/WithSelectedTasks';
import TaskNoteForm from 'components/tasks/note/TaskNoteForm';

function TaskTabs(props) {
    if (props.selectedTasks.length !== 1) {
        return (
            <Empty description="Please select one task" />
        );
    }

    return (
        <Tabs animated={false} style={{ height: '100%' }}>
            <Tabs.TabPane tab="Note" key="note" style={{ height: '100%' }}>
                <TaskNoteForm task={props.selectedTasks[0]} updateTask={props.updateTask} />
            </Tabs.TabPane>
        </Tabs>
    );
}

TaskTabs.propTypes = {
    selectedTasks: PropTypes.array.isRequired,
    setSelectedTaskIds: PropTypes.func.isRequired
};

export default withSelectedTasks(TaskTabs);