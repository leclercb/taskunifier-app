import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from 'antd';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import Logo from 'components/common/Logo';
import Spacer from 'components/common/Spacer';
import withApp from 'containers/WithApp';
import withNotes from 'containers/WithNotes';
import withPrint from 'containers/WithPrint';
import withTasks from 'containers/WithTasks';
import withTaskTemplates from 'containers/WithTaskTemplates';
import { NotePropType } from 'proptypes/NotePropTypes';
import { TaskPropType } from 'proptypes/TaskPropTypes';
import { TaskFilterPropType } from 'proptypes/TaskFilterPropTypes';
import { TaskTemplatePropType } from 'proptypes/TaskTemplatePropTypes';
import { applyTaskTemplate } from 'utils/TaskTemplateUtils';

function Header(props) {
    const onAddNote = () => {
        props.addNote({
            title: 'Untitled'
        }).then(id => props.setSelectedNoteIds([id]));
    };

    const onRemoveNotes = () => {
        props.deleteNote(props.selectedNoteIds);
    };

    const onPrintNotes = () => {
        props.printNotes(props.notes);
    };

    const onAddTask = () => {
        const task = {
            title: 'Untitled'
        };

        const taskTemplate = props.taskTemplates.find(taskTemplate =>
            taskTemplate.id === props.selectedTaskFilter.taskTemplate);

        applyTaskTemplate(taskTemplate, task);

        props.addTask(task).then(id => props.setSelectedTaskIds([id]));
    };

    const onCreateDummyTasks = () => {
        const taskTemplate = props.taskTemplates.find(taskTemplate =>
            taskTemplate.id === props.selectedTaskFilter.taskTemplate);

        for (let i = 0; i < 1000; i++) {
            const task = {
                title: 'Dummy Task ' + (i + 1),
                completed: Math.random() >= 0.5,
                star: Math.random() >= 0.5,
                progress: Math.floor((Math.random() * 100) + 1),
                importance: Math.floor((Math.random() * 12) + 1)
            };

            applyTaskTemplate(taskTemplate, task);

            props.addTask(task);
        }
    };

    const onEditTask = () => {
        props.setTaskEditionManagerOptions({
            visible: true,
            taskId: props.selectedTaskIds[0]
        });
    };

    const onRemoveTasks = () => {
        props.deleteTask(props.selectedTaskIds);
    };

    const onPrintTasks = () => {
        props.printTasks(props.tasks);
    };

    const onLoad = () => {
        props.loadData();
    };

    const onSave = () => {
        props.saveData();
    };

    const onBackup = () => {
        props.backupData();
    };

    const onSetSettingsVisible = () => {
        props.setSettingManagerOptions({ visible: true });
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

    const onSetNoteFilterManagerVisible = () => {
        props.setNoteFilterManagerOptions({ visible: true });
    };

    const onSetTaskFilterManagerVisible = () => {
        props.setTaskFilterManagerOptions({ visible: true });
    };

    const onSetTaskTemplateManagerVisible = () => {
        props.setTaskTemplateManagerOptions({ visible: true });
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
                    <img src="/resources/images/pro_badge.png" height={32} alt="Pro" style={{ marginRight: 10 }} />
                ) : null}
                <Logo size={40} />
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
            {props.selectedView === 'task' || props.selectedView === 'taskCalendar' ?
                createButton('plus', 'Add Task', onAddTask)
                : null}
            {props.selectedView === 'task' || props.selectedView === 'taskCalendar' ?
                createButton('plus', 'Create Dummy Tasks', onCreateDummyTasks)
                : null}
            {props.selectedView === 'task' || props.selectedView === 'taskCalendar' ?
                createButton('magic', 'Batch Add Tasks', onSetBatchAddTasksManagerVisible)
                : null}
            {props.selectedView === 'task' || props.selectedView === 'taskCalendar' ?
                createButton('magic', 'Batch Edit Tasks', onSetBatchEditTasksManagerVisible, props.selectedTaskIds.length !== 1)
                : null}
            {(props.selectedView === 'task' || props.selectedView === 'taskCalendar') ?
                createButton('edit', 'Edit Task', onEditTask, props.selectedTaskIds.length !== 1)
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
            <Spacer />
            <Spacer />
            {createButton('cubes', 'Category Manager', onSetCategoryManagerVisible)}
            {createButton('folder-open', 'Load', onLoad)}
            {createButton('save', 'Save', onSave)}
            {createButton('box-open', 'Backup', onBackup)}
            {createButton('cog', 'Settings', onSetSettingsVisible)}
        </LeftRight>
    );
}

Header.propTypes = {
    pro: PropTypes.bool.isRequired,
    notes: PropTypes.arrayOf(NotePropType.isRequired).isRequired,
    tasks: PropTypes.arrayOf(TaskPropType.isRequired).isRequired,
    taskTemplates: PropTypes.arrayOf(TaskTemplatePropType.isRequired).isRequired,
    selectedView: PropTypes.oneOf(['note', 'task', 'taskCalendar']).isRequired,
    selectedNoteIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    selectedTaskIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    selectedTaskFilter: TaskFilterPropType.isRequired,
    addNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
    printNotes: PropTypes.func.isRequired,
    addTask: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired,
    printTasks: PropTypes.func.isRequired,
    loadData: PropTypes.func.isRequired,
    saveData: PropTypes.func.isRequired,
    backupData: PropTypes.func.isRequired,
    setSelectedView: PropTypes.func.isRequired,
    setSelectedNoteIds: PropTypes.func.isRequired,
    setSelectedTaskIds: PropTypes.func.isRequired,
    setCategoryManagerOptions: PropTypes.func.isRequired,
    setNoteFilterManagerOptions: PropTypes.func.isRequired,
    setTaskFilterManagerOptions: PropTypes.func.isRequired,
    setTaskEditionManagerOptions: PropTypes.func.isRequired,
    setTaskTemplateManagerOptions: PropTypes.func.isRequired,
    setBatchAddTasksManagerOptions: PropTypes.func.isRequired,
    setBatchEditTasksManagerOptions: PropTypes.func.isRequired,
    setSettingManagerOptions: PropTypes.func.isRequired
};

export default withApp(withNotes(withTasks(withTaskTemplates(withPrint(Header)))));