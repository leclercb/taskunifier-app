import React from 'react';

export function getConfig(id) {
    switch (id) {
        case 'categoryManager': return getCategoryManagerConfig();
        case 'note': return getNoteConfig();
        case 'task': return getTaskConfig();
        case 'taskCalendar': return getTaskCalendarConfig();
        default: return null;
    }
}

export function getCategoryManagerConfig() {
    return {
        continuous: true,
        showProgress: true,
        steps: [
            {
                target: '.joyride-category-manager-tabs',
                placement: 'top',
                content: 'These tabs let you choose which kind of category you want to edit.'
            }
        ]
    };
}

export function getNoteConfig() {
    return {
        continuous: true,
        showProgress: true,
        steps: [
            {
                target: '.joyride-header',
                placement: 'bottom',
                content: 'This is the toolbar of TaskUnifier. It is were you will find most of the actions you can execute.'
            },
            {
                target: '.joyride-header-selected-view',
                placement: 'bottom',
                content: (
                    <React.Fragment>
                        <p>There are three main views in TaskUnifier:</p>
                        <ul>
                            <li>The &quot;Task&quot; view allows you to display and manage your tasks.</li>
                            <li>The &quot;Calendar&quot; view allows you to display and manage your tasks inside a calendar.</li>
                            <li>The &quot;Note&quot; view allows you to display and manage your notes.</li>
                        </ul>
                    </React.Fragment>
                )
            },
            {
                target: '.joyride-header-add-note',
                placement: 'bottom',
                content: 'This button allows you to create new notes.'
            },
            {
                target: '.joyride-header-settings',
                placement: 'bottom',
                content: 'This button will open the settings of TaskUnifier.'
            },
            {
                target: '.joyride-note-sider',
                placement: 'right',
                content: 'This is the note sider. It contains the list of filters you can apply to your notes and the categories to organize them.'
            },
            {
                target: '.joyride-note-table',
                placement: 'bottom',
                content: 'This is the note table. It contains your notes, filtered by the selected filter in the note sider.'
            },
            {
                target: '.joyride-note-tabs',
                placement: 'top',
                content: 'These are the note tabs. They contain extra information about the selected note, like the note content.'
            }
        ]
    };
}

export function getTaskConfig() {
    return {
        continuous: true,
        showProgress: true,
        steps: [
            {
                target: '.joyride-header',
                placement: 'bottom',
                content: 'This is the toolbar of TaskUnifier. It is were you will find most of the actions you can execute.'
            },
            {
                target: '.joyride-header-selected-view',
                placement: 'bottom',
                content: (
                    <React.Fragment>
                        <p>There are three main views in TaskUnifier:</p>
                        <ul>
                            <li>The &quot;Task&quot; view allows you to display and manage your tasks.</li>
                            <li>The &quot;Calendar&quot; view allows you to display and manage your tasks inside a calendar.</li>
                            <li>The &quot;Note&quot; view allows you to display and manage your notes.</li>
                        </ul>
                    </React.Fragment>
                )
            },
            {
                target: '.joyride-header-add-task',
                placement: 'bottom',
                content: 'This button allows you to create new tasks.'
            },
            {
                target: '.joyride-header-settings',
                placement: 'bottom',
                content: 'This button will open the settings of TaskUnifier.'
            },
            {
                target: '.joyride-task-sider',
                placement: 'right',
                content: 'This is the task sider. It contains the list of filters you can apply to your tasks and the categories to organize them.'
            },
            {
                target: '.joyride-task-quick-add',
                placement: 'bottom',
                content: 'This is the "Quick Add Task" bar, which allows you to quickly add task with predefined values.'
            },
            {
                target: '.joyride-task-table',
                placement: 'bottom',
                content: 'This is the task table. It contains your tasks, filtered by the selected filter in the task sider.'
            },
            {
                target: '.joyride-task-tabs',
                placement: 'top',
                content: 'These are the task tabs. They contain extra information about the selected task, like the notes and the linked entities.'
            }
        ]
    };
}

export function getTaskCalendarConfig() {
    return {
        continuous: true,
        showProgress: true,
        steps: [
            {
                target: '.joyride-header',
                placement: 'bottom',
                content: 'This is the toolbar of TaskUnifier. It is were you will find most of the actions you can execute.'
            },
            {
                target: '.joyride-header-selected-view',
                placement: 'bottom',
                content: (
                    <React.Fragment>
                        <p>There are three main views in TaskUnifier:</p>
                        <ul>
                            <li>The &quot;Task&quot; view allows you to display and manage your tasks.</li>
                            <li>The &quot;Calendar&quot; view allows you to display and manage your tasks inside a calendar.</li>
                            <li>The &quot;Note&quot; view allows you to display and manage your notes.</li>
                        </ul>
                    </React.Fragment>
                )
            },
            {
                target: '.joyride-header-add-task',
                placement: 'bottom',
                content: 'This button allows you to create new tasks.'
            },
            {
                target: '.joyride-header-settings',
                placement: 'bottom',
                content: 'This button will open the settings of TaskUnifier.'
            },
            {
                target: '.joyride-task-sider',
                placement: 'right',
                content: 'This is the task sider. It contains the list of filters you can apply to your tasks and the categories to organize them.'
            },
            {
                target: '.joyride-task-quick-add',
                placement: 'bottom',
                content: 'This is the "Quick Add Task" bar, which allows you to quickly add task with predefined values.'
            },
            {
                target: '.joyride-task-calendar',
                placement: 'bottom',
                content: 'This is the task calendar. It contains your tasks, filtered by the selected filter in the task sider.'
            },
            {
                target: '.joyride-task-tabs',
                placement: 'top',
                content: 'These are the task tabs. They contain extra information about the selected task, like the notes and the linked entities.'
            }
        ]
    };
}