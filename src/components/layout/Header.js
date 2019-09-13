import React from 'react';
import { Button, Tooltip } from 'antd';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import Logo from 'components/common/Logo';
import Spacer from 'components/common/Spacer';
import UserMenu from 'components/layout/UserMenu';
import { useAppApi } from 'hooks/UseAppApi';
import { useNoteApi } from 'hooks/UseNoteApi';
import { usePrintApi } from 'hooks/UsePrintApi';
import { useTaskApi } from 'hooks/UseTaskApi';
import { useTaskTemplateApi } from 'hooks/UseTaskTemplateApi';
import { applyTaskTemplate } from 'utils/TaskTemplateUtils';

function Header() {
    const appApi = useAppApi();
    const noteApi = useNoteApi();
    const taskApi = useTaskApi();
    const printApi = usePrintApi();
    const taskTemplatesApi = useTaskTemplateApi();

    const onAddNote = async () => {
        const note = await noteApi.addNote();
        noteApi.setSelectedNoteIds(note.id);
        appApi.setEditingCell(note.id, 'title');
    };

    const onRemoveNotes = () => {
        noteApi.deleteNote(noteApi.selectedNoteIds);
    };

    const onPrintNotes = () => {
        printApi.printNotes(noteApi.notes);
    };

    const onAddTask = async () => {
        let task = {};

        const taskTemplate = taskTemplatesApi.taskTemplates.find(taskTemplate =>
            taskTemplate.id === taskApi.selectedTaskFilter.taskTemplate);

        applyTaskTemplate(taskTemplate, task);

        task = await taskApi.addTask(task);
        taskApi.setSelectedTaskIds(task.id);
        appApi.setEditingCell(task.id, 'title');
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
        printApi.printTasks(taskApi.tasks);
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

    const onShowTaskContent = () => {
        appApi.setSelectedView('task');
    };

    const onShowTaskCalendarContent = () => {
        appApi.setSelectedView('taskCalendar');
    };

    const onShowNoteContent = () => {
        appApi.setSelectedView('note');
    };

    const createButton = (icon, text, onClick, disabled = false) => {
        return (
            <React.Fragment>
                <Tooltip placement="bottom" title={text}>
                    <Button onClick={onClick} disabled={disabled}>
                        <Icon icon={icon} />
                    </Button>
                </Tooltip>
                <Spacer />
            </React.Fragment>
        );
    };

    return (
        <LeftRight right={(
            <React.Fragment>
                {appApi.pro ? (
                    <img src="resources/images/pro_badge.png" height={32} alt="Pro" style={{ marginRight: 10 }} />
                ) : null}
                {process.env.REACT_APP_MODE === 'electron' ? (<Logo alt={true} size={40} />) : (<UserMenu />)}
            </React.Fragment>
        )}>
            <Button.Group style={{ marginRight: 50 }}>
                <Button
                    type={appApi.selectedView === 'task' ? 'dashed' : 'default'}
                    onClick={onShowTaskContent}>
                    <Icon icon="tasks" text="Tasks" />
                </Button>
                <Button
                    type={appApi.selectedView === 'taskCalendar' ? 'dashed' : 'default'}
                    onClick={onShowTaskCalendarContent}>
                    <Icon icon="calendar-alt" text="Calendar" />
                </Button>
                <Button
                    type={appApi.selectedView === 'note' ? 'dashed' : 'default'}
                    onClick={onShowNoteContent}>
                    <Icon icon="book" text="Notes" />
                </Button>
            </Button.Group>
            {appApi.selectedView === 'note' ?
                createButton('plus', 'Add Note', onAddNote)
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
                createButton('plus', 'Add Task', onAddTask)
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
            <Spacer />
            <Spacer />
            {createButton('cubes', 'Category Manager', onSetCategoryManagerVisible)}
            {createButton('bell', 'Reminder Manager', onSetReminderManagerVisible)}
            {process.env.REACT_APP_MODE === 'electron' ?
                createButton('save', 'Save', onSave)
                : null}
            {process.env.REACT_APP_MODE === 'electron' ?
                createButton('box-open', 'Backup', onBackup)
                : null}
            {createButton('cog', 'Settings', onSetSettingsVisible)}
            {process.env.REACT_APP_MODE === 'electron' ?
                createButton('sync-alt', 'Synchronization', onSynchronize)
                : null}
        </LeftRight>
    );
}

export default Header;