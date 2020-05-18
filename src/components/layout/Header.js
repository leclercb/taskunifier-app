import React, { useState } from 'react';
import { Button, Tooltip } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import Logo from 'components/common/Logo';
import UserMenu from 'components/layout/UserMenu';
import withBusyCheck from 'containers/WithBusyCheck';
import { useAppApi } from 'hooks/UseAppApi';
import { useInterval } from 'hooks/UseInterval';
import { useJoyrideApi } from 'hooks/UseJoyrideApi';
import { useNoteApi } from 'hooks/UseNoteApi';
import { useNoteFieldApi } from 'hooks/UseNoteFieldApi';
import { usePrintApi } from 'hooks/UsePrintApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTaskApi } from 'hooks/UseTaskApi';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { useTaskTemplateApi } from 'hooks/UseTaskTemplateApi';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { getSecondsUntilNextSave } from 'utils/AppUtils';
import { getSecondsUntilNextBackup } from 'utils/BackupUtils';
import { getSecondsUntilNextPub } from 'utils/PublicationUtils';
import { getSecondsUntilNextSync } from 'utils/SynchronizationUtils';
import { applyNoteTemplateFromNoteFilter, applyTaskTemplate, applyTaskTemplateFromTaskFilter } from 'utils/TemplateUtils';

function Header({ apis }) {
    const { appApi, joyrideApi, noteApi, noteFieldApi, printApi, settingsApi, taskApi, taskFieldApi, taskTemplateApi } = apis;

    const onAddNote = async () => {
        let note = {};

        applyNoteTemplateFromNoteFilter(noteApi.selectedNoteFilter, note, noteFieldApi.noteFields);

        note = await noteApi.addNote(note);
        noteApi.setSelectedNoteIds(note.id);
        appApi.setEditingCell(note.id, 'title');
    };

    const onRemoveNotes = () => {
        noteApi.deleteNote(noteApi.selectedNoteIds);
    };

    const onPrintNotes = () => {
        printApi.printNotes(noteApi.filteredNotes);
    };

    const onAddTask = async () => {
        let task = {};

        applyTaskTemplate(taskTemplateApi.defaultTaskTemplate, task, taskFieldApi.taskFields);
        applyTaskTemplateFromTaskFilter(taskApi.selectedTaskFilter, taskTemplateApi.taskTemplates, task, taskFieldApi.taskFields);

        task = await taskApi.addTask(task);
        taskApi.setSelectedTaskIds(task.id);

        if (settingsApi.settings.openTaskEditionManagerWhenTaskAdded) {
            appApi.setTaskEditionManagerOptions({
                visible: true,
                taskId: task.id
            });
        } else {
            appApi.setEditingCell(task.id, 'title');
        }
    };

    const onEditTask = () => {
        appApi.setTaskEditionManagerOptions({
            visible: true,
            taskId: taskApi.selectedTaskIds[0]
        });
    };

    const onRemoveTasks = () => {
        taskApi.deleteTask(taskApi.selectedTaskIds);
    };

    const onPrintTasks = () => {
        printApi.printTasks(taskApi.filteredTasks);
    };

    const onSave = () => {
        appApi.saveData();
    };

    const onBackup = () => {
        appApi.backupData();
    };

    const onSetBatchAddTasksManagerVisible = () => {
        appApi.setBatchAddTasksManagerOptions({ visible: true });
    };

    const onSetBatchEditTasksManagerVisible = () => {
        appApi.setBatchEditTasksManagerOptions({ visible: true });
    };

    const onSetCategoryManagerVisible = () => {
        appApi.setCategoryManagerOptions({ visible: true });
    };

    const onSetReminderManagerVisible = () => {
        appApi.setReminderManagerOptions({ visible: true });
    };

    const onSetNoteFieldManagerVisible = () => {
        appApi.setNoteFieldManagerOptions({ visible: true });
    };

    const onSetNoteFilterManagerVisible = () => {
        appApi.setNoteFilterManagerOptions({ visible: true });
    };

    const onSetTaskFieldManagerVisible = () => {
        appApi.setTaskFieldManagerOptions({ visible: true });
    };

    const onSetTaskFilterManagerVisible = () => {
        appApi.setTaskFilterManagerOptions({ visible: true });
    };

    const onSetTaskTemplateManagerVisible = () => {
        appApi.setTaskTemplateManagerOptions({ visible: true });
    };

    const onSetSettingsVisible = () => {
        appApi.setSettingManagerOptions({ visible: true });
    };

    const onSynchronize = () => {
        appApi.synchronize();
    };

    const onPublish = () => {
        appApi.publish();
    };

    const onShowTaskContent = () => {
        appApi.setSelectedView('task');
    };

    const onShowTaskCalendarContent = () => {
        appApi.setSelectedView('taskCalendar');
    };

    const onShowNoteContent = () => {
        appApi.setSelectedView('note');
    };

    const onShowHelp = () => {
        joyrideApi.setJoyrideOptions({
            id: appApi.selectedView,
            run: true,
            stepIndex: 0
        });
    };

    const createButton = (icon, text, onClick, disabled = false, className = '') => {
        const button = (
            <Button onClick={onClick} disabled={disabled} className={className}>
                <Icon icon={icon} />
            </Button>
        );

        if (disabled) {
            return button;
        }

        return (
            <Tooltip placement="bottom" title={text}>
                {button}
            </Tooltip>
        );
    };

    return (
        <LeftRight
            className="joyride-header"
            right={(
                <React.Fragment>
                    {appApi.isPro ? (
                        <img src="resources/images/pro_badge.png" height={32} alt="Pro" style={{ marginRight: 10 }} />
                    ) : null}
                    {process.env.REACT_APP_MODE === 'electron' ? (<Logo alt={true} size={40} />) : (<UserMenu />)}
                </React.Fragment>
            )}>
            <Button.Group style={{ marginRight: 20 }} className="joyride-header-selected-view">
                <Button
                    type={appApi.selectedView === 'task' ? 'primary' : 'default'}
                    onClick={onShowTaskContent}>
                    <Icon icon="tasks" text="Tasks" />
                </Button>
                <Button
                    type={appApi.selectedView === 'taskCalendar' ? 'primary' : 'default'}
                    onClick={onShowTaskCalendarContent}>
                    <Icon icon="calendar-alt" text="Calendar" />
                </Button>
                <Button
                    type={appApi.selectedView === 'note' ? 'primary' : 'default'}
                    onClick={onShowNoteContent}>
                    <Icon icon="book" text="Notes" />
                </Button>
            </Button.Group>
            <Button.Group style={{ marginRight: 20 }}>
                {appApi.selectedView === 'note' ?
                    createButton('plus', 'Add Note', onAddNote, false, 'joyride-header-add-note')
                    : null}
                {appApi.selectedView === 'note' ?
                    createButton('trash-alt', 'Remove Note(s)', onRemoveNotes)
                    : null}
                {appApi.selectedView === 'note' ?
                    createButton('print', 'Print Notes', onPrintNotes)
                    : null}
                {appApi.selectedView === 'note' ?
                    createButton('filter', 'Note Filter Manager', onSetNoteFilterManagerVisible)
                    : null}
                {appApi.selectedView === 'note' ?
                    createButton('columns', 'Note Field Manager', onSetNoteFieldManagerVisible)
                    : null}
                {appApi.selectedView === 'task' || appApi.selectedView === 'taskCalendar' ?
                    createButton('plus', 'Add Task', onAddTask, false, 'joyride-header-add-task')
                    : null}
                {appApi.selectedView === 'task' || appApi.selectedView === 'taskCalendar' ?
                    createButton('list', 'Batch Add Tasks', onSetBatchAddTasksManagerVisible)
                    : null}
                {(appApi.selectedView === 'task' || appApi.selectedView === 'taskCalendar') ?
                    createButton('edit', 'Edit Task', onEditTask, taskApi.selectedTaskIds.length !== 1)
                    : null}
                {appApi.selectedView === 'task' || appApi.selectedView === 'taskCalendar' ?
                    createButton('magic', 'Batch Edit Tasks', onSetBatchEditTasksManagerVisible, taskApi.selectedTaskIds.length <= 1 || taskApi.selectedTaskIds.length > 50)
                    : null}
                {appApi.selectedView === 'task' || appApi.selectedView === 'taskCalendar' ?
                    createButton('trash-alt', 'Remove Task(s)', onRemoveTasks)
                    : null}
                {appApi.selectedView === 'task' || appApi.selectedView === 'taskCalendar' ?
                    createButton('print', 'Print Tasks', onPrintTasks)
                    : null}
                {appApi.selectedView === 'task' || appApi.selectedView === 'taskCalendar' ?
                    createButton('filter', 'Task Filter Manager', onSetTaskFilterManagerVisible)
                    : null}
                {appApi.selectedView === 'task' || appApi.selectedView === 'taskCalendar' ?
                    createButton('tasks', 'Task Template Manager', onSetTaskTemplateManagerVisible)
                    : null}
                {appApi.selectedView === 'task' || appApi.selectedView === 'taskCalendar' ?
                    createButton('columns', 'Task Field Manager', onSetTaskFieldManagerVisible)
                    : null}
            </Button.Group>
            <Button.Group style={{ marginRight: 20 }}>
                {createButton('cubes', 'Category Manager', onSetCategoryManagerVisible, false, 'joyride-header-category-manager')}
                {createButton('bell', 'Reminder Manager', onSetReminderManagerVisible)}
                {process.env.REACT_APP_MODE === 'electron' ? (
                    <SaveButton
                        settings={settingsApi.settings}
                        startDate={appApi.startDate}
                        save={onSave} />
                ) : null}
                {process.env.REACT_APP_MODE === 'electron' ? (
                    <BackupButton
                        settings={settingsApi.settings}
                        backup={onBackup} />
                ) : null}
                {createButton('cog', 'Settings', onSetSettingsVisible, false, 'joyride-header-settings')}
                {process.env.REACT_APP_MODE === 'electron' ? (
                    <SynchronizationButton
                        settings={settingsApi.settings}
                        isPro={appApi.isPro}
                        synchronize={onSynchronize} />
                ) : null}
                {process.env.REACT_APP_MODE === 'electron' ? (
                    <PublicationButton
                        settings={settingsApi.settings}
                        isPro={appApi.isPro}
                        publish={onPublish} />
                ) : null}
            </Button.Group>
            <Button.Group>
                {createButton('question-circle', 'Help', onShowHelp)}
            </Button.Group>
        </LeftRight>
    );
}

function SaveButton({ settings, startDate, save }) {
    const [seconds, setSeconds] = useState(getSecondsUntilNextSave(settings, startDate));

    useInterval(() => {
        setSeconds(getSecondsUntilNextSave(settings, startDate));
    }, 5000);

    const now = moment();

    const title = (
        <React.Fragment>
            Save
            <br />
            <em>{seconds >= 0 ? 'Next save ' + now.to(moment(now).add(seconds + 1, 'second')) : 'Automatic save is disabled'}</em>
        </React.Fragment>
    );

    return (
        <Tooltip placement="bottom" title={title}>
            <Button onClick={save}>
                <Icon icon="save" />
            </Button>
        </Tooltip>
    );
}

SaveButton.propTypes = {
    settings: SettingsPropType.isRequired,
    startDate: PropTypes.string.isRequired,
    save: PropTypes.func.isRequired
};

function BackupButton({ settings, backup }) {
    const [seconds, setSeconds] = useState(getSecondsUntilNextBackup(settings));

    useInterval(() => {
        setSeconds(getSecondsUntilNextBackup(settings));
    }, 5000);

    const now = moment();

    const title = (
        <React.Fragment>
            Backup
            <br />
            <em>{seconds >= 0 ? 'Next backup ' + now.to(moment(now).add(seconds + 1, 'second')) : 'Automatic backup is disabled'}</em>
        </React.Fragment>
    );

    return (
        <Tooltip placement="bottom" title={title}>
            <Button onClick={backup}>
                <Icon icon="box-open" />
            </Button>
        </Tooltip>
    );
}

BackupButton.propTypes = {
    settings: SettingsPropType.isRequired,
    backup: PropTypes.func.isRequired
};

function SynchronizationButton({ settings, isPro, synchronize }) {
    const [seconds, setSeconds] = useState(getSecondsUntilNextSync(settings, isPro));

    useInterval(() => {
        setSeconds(getSecondsUntilNextSync(settings, isPro));
    }, 5000);

    const now = moment();

    const title = (
        <React.Fragment>
            Synchronize
            <br />
            <em>{seconds >= 0 ? 'Next synchronization ' + now.to(moment(now).add(seconds + 1, 'second')) : 'Automatic synchronization is disabled'}</em>
        </React.Fragment>
    );

    return (
        <Tooltip placement="bottom" title={title}>
            <Button onClick={synchronize}>
                <Icon icon="sync-alt" />
            </Button>
        </Tooltip>
    );
}

SynchronizationButton.propTypes = {
    settings: SettingsPropType.isRequired,
    isPro: PropTypes.bool.isRequired,
    synchronize: PropTypes.func.isRequired
};

function PublicationButton({ settings, isPro, publish }) {
    const [seconds, setSeconds] = useState(getSecondsUntilNextPub(settings, isPro));

    useInterval(() => {
        setSeconds(getSecondsUntilNextPub(settings, isPro));
    }, 5000);

    const now = moment();

    const title = (
        <React.Fragment>
            Publish
            <br />
            <em>{seconds >= 0 ? 'Next publication ' + now.to(moment(now).add(seconds + 1, 'second')) : 'Automatic publication is disabled'}</em>
        </React.Fragment>
    );

    return (
        <Tooltip placement="bottom" title={title}>
            <Button onClick={publish}>
                <Icon icon="upload" />
            </Button>
        </Tooltip>
    );
}

PublicationButton.propTypes = {
    settings: SettingsPropType.isRequired,
    isPro: PropTypes.bool.isRequired,
    publish: PropTypes.func.isRequired
};

Header.propTypes = {
    apis: PropTypes.object.isRequired
};

export default withBusyCheck(Header, () => ({
    appApi: useAppApi(),
    joyrideApi: useJoyrideApi(),
    noteApi: useNoteApi(),
    noteFieldApi: useNoteFieldApi(),
    printApi: usePrintApi(),
    settingsApi: useSettingsApi(),
    taskApi: useTaskApi(),
    taskFieldApi: useTaskFieldApi(),
    taskTemplateApi: useTaskTemplateApi()
}));