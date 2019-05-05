import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from 'antd';
import Icon from 'components/common/Icon';
import withApp from 'containers/WithApp';
import withNotes from 'containers/WithNotes';
import withTasks from 'containers/WithTasks';
import Spacer from 'components/common/Spacer';
import LeftRight from 'components/common/LeftRight';
import Logo from 'components/common/Logo';

function Header(props) {
    const onAddNote = () => {
        props.addNote({
            title: 'Untitled'
        }).then(id => props.setSelectedNoteIds([id]));
    };

    const onRemoveNotes = () => {
        props.deleteNote(props.selectedNoteIds);
    };

    const onAddTask = () => {
        props.addTask({
            title: 'Untitled'
        }).then(id => props.setSelectedTaskIds([id]));
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

    const onSetBatchAddTasksVisible = () => {
        props.setBatchAddTasksOptions({ visible: true });
    };

    const onShowTaskContent = () => {
        props.setSelectedView('task');
    };

    const onShowTaskCalendarContent = () => {
        props.setSelectedView('task-calendar');
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
                    type={props.selectedView === 'task-calendar' ? 'dashed' : 'default'}
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
                createButton('filter', 'Note Filter Manager', onSetNoteFilterManagerVisible)
                : null}
            {props.selectedView === 'task' || props.selectedView === 'task-calendar' ?
                createButton('plus', 'Add Task', onAddTask)
                : null}
            {(props.selectedView === 'task' || props.selectedView === 'task-calendar') ?
                createButton('edit', 'Edit Task', onEditTask, props.selectedTaskIds.length !== 1)
                : null}
            {props.selectedView === 'task' ?
                createButton('trash-alt', 'Remove Task(s)', onRemoveTasks)
                : null}
            {props.selectedView === 'task' || props.selectedView === 'task-calendar' ?
                createButton('magic', 'Batch Add Tasks', onSetBatchAddTasksVisible)
                : null}
            {props.selectedView === 'task' || props.selectedView === 'task-calendar' ?
                createButton('filter', 'Task Filter Manager', onSetTaskFilterManagerVisible)
                : null}
            {props.selectedView === 'task' || props.selectedView === 'task-calendar' ?
                createButton('tasks', 'Task Template Manager', onSetTaskTemplateManagerVisible)
                : null}
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
    selectedView: PropTypes.string.isRequired,
    selectedNoteIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    selectedTaskIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    addNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
    addTask: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired,
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
    setBatchAddTasksOptions: PropTypes.func.isRequired,
    setSettingManagerOptions: PropTypes.func.isRequired
};

export default withApp(withNotes(withTasks(Header)));