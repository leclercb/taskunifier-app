import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from 'antd';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import Logo from 'components/common/Logo';
import Spacer from 'components/common/Spacer';
import UserMenu from 'components/layout/UserMenu';
import withApp from 'containers/WithApp';
import { useNotes } from 'hooks/UseNotes';
import { usePrint } from 'hooks/UsePrint';
import { useTasks } from 'hooks/UseTasks';
import { useTaskTemplates } from 'hooks/UseTaskTemplates';
import { applyTaskTemplate } from 'utils/TaskTemplateUtils';

function Header(props) {
    const noteApi = useNotes();
    const taskApi = useTasks();
    const printApi = usePrint();
    const taskTemplatesApi = useTaskTemplates();

    const onAddNote = async () => {
        const note = await noteApi.addNote();
        noteApi.setSelectedNoteIds([note.id]);
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
        taskApi.setSelectedTaskIds([task.id]);
    };

    const onEditTask = () => {
        props.setTaskEditionManagerOptions({
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
        props.saveData();
    };

    const onBackup = () => {
        props.backupData();
    };

    const onSetBatchAddTasksManagerVisible = () => {
        props.setBatchAddTasksManagerOptions({ visible: true });
    };

    const onSetBatchEditTasksManagerVisible = () => {
        props.setBatchEditTasksManagerOptions({ visible: true });
    };

    const onSetCategoryManagerVisible = () => {
        props.setCategoryManagerOptions({ visible: true });
    };

    const onSetReminderManagerVisible = () => {
        props.setReminderManagerOptions({ visible: true });
    };

    const onSetNoteFieldManagerVisible = () => {
        props.setNoteFieldManagerOptions({ visible: true });
    };

    const onSetNoteFilterManagerVisible = () => {
        props.setNoteFilterManagerOptions({ visible: true });
    };

    const onSetTaskFieldManagerVisible = () => {
        props.setTaskFieldManagerOptions({ visible: true });
    };

    const onSetTaskFilterManagerVisible = () => {
        props.setTaskFilterManagerOptions({ visible: true });
    };

    const onSetTaskTemplateManagerVisible = () => {
        props.setTaskTemplateManagerOptions({ visible: true });
    };

    const onSetSettingsVisible = () => {
        props.setSettingManagerOptions({ visible: true });
    };

    const onSynchronize = () => {
        props.synchronize();
    };

    const onShowTaskContent = () => {
        props.setSelectedView('task');
    };

    const onShowTaskCalendarContent = () => {
        props.setSelectedView('taskCalendar');
    };

    const onShowNoteContent = () => {
        props.setSelectedView('note');
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
                {props.pro ? (
                    <img src="resources/images/pro_badge.png" height={32} alt="Pro" style={{ marginRight: 10 }} />
                ) : null}
                {process.env.REACT_APP_MODE === 'electron' ? (<Logo alt={true} size={40} />) : (<UserMenu />)}
            </React.Fragment>
        )}>
            <Button.Group style={{ marginRight: 50 }}>
                <Button
                    type={props.selectedView === 'task' ? 'dashed' : 'default'}
                    onClick={onShowTaskContent}>
                    <Icon icon="tasks" text="Tasks" />
                </Button>
                <Button
                    type={props.selectedView === 'taskCalendar' ? 'dashed' : 'default'}
                    onClick={onShowTaskCalendarContent}>
                    <Icon icon="calendar-alt" text="Calendar" />
                </Button>
                <Button
                    type={props.selectedView === 'note' ? 'dashed' : 'default'}
                    onClick={onShowNoteContent}>
                    <Icon icon="book" text="Notes" />
                </Button>
            </Button.Group>
            {props.selectedView === 'note' ?
                createButton('plus', 'Add Note', onAddNote)
                : null}
            {props.selectedView === 'note' ?
                createButton('trash-alt', 'Remove Note(s)', onRemoveNotes)
                : null}
            {props.selectedView === 'note' ?
                createButton('print', 'Print Notes', onPrintNotes)
                : null}
            {props.selectedView === 'note' ?
                createButton('filter', 'Note Filter Manager', onSetNoteFilterManagerVisible)
                : null}
            {props.selectedView === 'note' ?
                createButton('columns', 'Note Field Manager', onSetNoteFieldManagerVisible)
                : null}
            {props.selectedView === 'task' || props.selectedView === 'taskCalendar' ?
                createButton('plus', 'Add Task', onAddTask)
                : null}
            {props.selectedView === 'task' || props.selectedView === 'taskCalendar' ?
                createButton('list', 'Batch Add Tasks', onSetBatchAddTasksManagerVisible)
                : null}
            {(props.selectedView === 'task' || props.selectedView === 'taskCalendar') ?
                createButton('edit', 'Edit Task', onEditTask, taskApi.selectedTaskIds.length !== 1)
                : null}
            {props.selectedView === 'task' || props.selectedView === 'taskCalendar' ?
                createButton('magic', 'Batch Edit Tasks', onSetBatchEditTasksManagerVisible, taskApi.selectedTaskIds.length <= 1 || taskApi.selectedTaskIds.length > 50)
                : null}
            {props.selectedView === 'task' || props.selectedView === 'taskCalendar' ?
                createButton('trash-alt', 'Remove Task(s)', onRemoveTasks)
                : null}
            {props.selectedView === 'task' || props.selectedView === 'taskCalendar' ?
                createButton('print', 'Print Tasks', onPrintTasks)
                : null}
            {props.selectedView === 'task' || props.selectedView === 'taskCalendar' ?
                createButton('filter', 'Task Filter Manager', onSetTaskFilterManagerVisible)
                : null}
            {props.selectedView === 'task' || props.selectedView === 'taskCalendar' ?
                createButton('tasks', 'Task Template Manager', onSetTaskTemplateManagerVisible)
                : null}
            {props.selectedView === 'task' || props.selectedView === 'taskCalendar' ?
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

Header.propTypes = {
    pro: PropTypes.bool.isRequired,
    selectedView: PropTypes.oneOf(['note', 'task', 'taskCalendar']).isRequired,
    saveData: PropTypes.func.isRequired,
    backupData: PropTypes.func.isRequired,
    synchronize: PropTypes.func.isRequired,
    setSelectedView: PropTypes.func.isRequired,
    setCategoryManagerOptions: PropTypes.func.isRequired,
    setReminderManagerOptions: PropTypes.func.isRequired,
    setNoteFieldManagerOptions: PropTypes.func.isRequired,
    setNoteFilterManagerOptions: PropTypes.func.isRequired,
    setTaskFieldManagerOptions: PropTypes.func.isRequired,
    setTaskFilterManagerOptions: PropTypes.func.isRequired,
    setTaskEditionManagerOptions: PropTypes.func.isRequired,
    setTaskTemplateManagerOptions: PropTypes.func.isRequired,
    setBatchAddTasksManagerOptions: PropTypes.func.isRequired,
    setBatchEditTasksManagerOptions: PropTypes.func.isRequired,
    setSettingManagerOptions: PropTypes.func.isRequired
};

export default withApp(Header);