import React from 'react';
import PropTypes from 'prop-types';
import { Empty, Tabs } from 'antd';
import withSelectedTasks from 'containers/WithSelectedTasks';
import TaskNoteForm from 'components/tasks/note/TaskNoteForm';
import LinkedContactGrid from 'components/tasks/linkedcontact/LinkedContactGrid';
import LinkedFileGrid from 'components/tasks/linkedfile/LinkedFileGrid';
import LinkedTaskGrid from 'components/tasks/linkedtask/LinkedTaskGrid';

function TaskTabs(props) {
    if (props.selectedTasks.length !== 1) {
        return (
            <Empty description="Please select one task" />
        );
    }

    const onUpdateLinkedContacts = linkedContacts => {
        props.updateTask({
            ...props.selectedTasks[0],
            linkedContacts: linkedContacts
        });
    };

    const onUpdateLinkedFiles = linkedFiles => {
        props.updateTask({
            ...props.selectedTasks[0],
            linkedFiles: linkedFiles
        });
    };

    const onUpdateLinkedTasks = linkedTasks => {
        props.updateTask({
            ...props.selectedTasks[0],
            linkedTasks: linkedTasks
        });
    };

    return (
        <Tabs animated={false}>
            <Tabs.TabPane tab="Note" key="note">
                <TaskNoteForm
                    task={props.selectedTasks[0]}
                    updateTask={props.updateTask} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Linked Contacts" key="linkedContacts">
                <LinkedContactGrid
                    linkedContacts={props.selectedTasks[0].linkedContacts || []}
                    updateLinkedContacts={onUpdateLinkedContacts} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Linked Files" key="linkedFiles">
                <LinkedFileGrid
                    linkedFiles={props.selectedTasks[0].linkedFiles || []}
                    updateLinkedFiles={onUpdateLinkedFiles} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Linked Tasks" key="linkedTasks">
                <LinkedTaskGrid
                    linkedTasks={props.selectedTasks[0].linkedTasks || []}
                    updateLinkedTasks={onUpdateLinkedTasks} />
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