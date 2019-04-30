import React from 'react';
import PropTypes from 'prop-types';
import { Empty, Tabs } from 'antd';
import withSelectedTasks from 'containers/WithSelectedTasks';
import TaskNoteForm from 'components/tasks/note/TaskNoteForm';
import ContactLinkGrid from 'components/tasks/contactlink/ContactLinkGrid';

function TaskTabs(props) {
    if (props.selectedTasks.length !== 1) {
        return (
            <Empty description="Please select one task" />
        );
    }

    const onUpdateContactLinks = contactLinks => {
        props.updateTask({
            ...props.selectedTasks[0],
            contactLinks: contactLinks
        });
    };

    return (
        <Tabs animated={false}>
            <Tabs.TabPane tab="Note" key="note">
                <TaskNoteForm
                    task={props.selectedTasks[0]}
                    updateTask={props.updateTask} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Contact Links" key="contactLink">
                <ContactLinkGrid
                    contactLinks={props.selectedTasks[0].contactLinks || []}
                    updateContactLinks={onUpdateContactLinks} />
            </Tabs.TabPane>
        </Tabs>
    );
}

TaskTabs.propTypes = {
    selectedTasks: PropTypes.array.isRequired,
    setSelectedTaskIds: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired
};

export default withSelectedTasks(TaskTabs);