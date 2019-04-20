import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from 'antd';
import Icon from '../common/Icon';
import withApp from '../../containers/WithApp';
import withTasks from '../../containers/WithTasks';
import Spacer from '../common/Spacer';
import LeftRight from '../common/LeftRight';
import Logo from '../common/Logo';

function Header(props) {
    const onAddTask = () => {
        props.addTask({
            title: 'Untitled'
        }).then(id => props.setSelectedTaskIds([id]));
    }

    const onLoad = () => {
        props.loadData();
    };

    const onSave = () => {
        props.saveData();
    };

    const onBackup = () => {
        props.backupData();
    };

    const onCleanBackups = () => {
        props.cleanBackups();
    };

    const onSynchronize = () => {
        props.synchronize();
    };

    const onSetSettingsVisible = () => {
        props.setSettingManagerOptions({ visible: true });
    };

    const onSetCategoryManagerVisible = () => {
        props.setCategoryManagerOptions({ visible: true });
    };

    const onSetFilterManagerVisible = () => {
        props.setFilterManagerOptions({ visible: true });
    };

    const onSetTaskTemplateManagerVisible = () => {
        props.setTaskTemplateManagerOptions({ visible: true });
    };

    const onSetBatchAddTasksVisible = () => {
        props.setBatchAddTasksOptions({ visible: true });
    };

    const createButton = (icon, text, onClick) => {
        return (
            <React.Fragment>
                <Tooltip placement="bottom" title={text}>
                    <Button onClick={onClick}>
                        <Icon icon={icon} />
                    </Button>
                </Tooltip>
                <Spacer />
            </React.Fragment>
        );
    }

    return (
        <LeftRight right={(
            <React.Fragment>
                {props.pro ? (
                    <img src="/resources/images/pro_badge.png" height={32} alt="Pro" style={{ marginRight: 10 }} />
                ) : null}
                <Logo size={40} />
            </React.Fragment>
        )}>
            {createButton('plus', 'Add Task', onAddTask)}
            {createButton('folder-open', 'Load', onLoad)}
            {createButton('save', 'Save', onSave)}
            {createButton('box-open', 'Backup', onBackup)}
            {createButton('broom', 'Clean Backups', onCleanBackups)}
            {createButton('cogs', 'Synchronize', onSynchronize)}
            {createButton('cog', 'Settings', onSetSettingsVisible)}
            {createButton('cubes', 'Category Manager', onSetCategoryManagerVisible)}
            {createButton('filter', 'Filter Manager', onSetFilterManagerVisible)}
            {createButton('tasks', 'Task Template Manager', onSetTaskTemplateManagerVisible)}
            {createButton('tasks', 'Batch Add Tasks', onSetBatchAddTasksVisible)}
        </LeftRight>
    );
}

Header.propTypes = {
    addTask: PropTypes.func.isRequired,
    pro: PropTypes.bool.isRequired,
    loadData: PropTypes.func.isRequired,
    saveData: PropTypes.func.isRequired,
    backupData: PropTypes.func.isRequired,
    cleanBackups: PropTypes.func.isRequired,
    synchronize: PropTypes.func.isRequired,
    setCategoryManagerOptions: PropTypes.func.isRequired,
    setFilterManagerOptions: PropTypes.func.isRequired,
    setTaskTemplateManagerOptions: PropTypes.func.isRequired,
    setSettingManagerOptions: PropTypes.func.isRequired
};

export default withApp(withTasks(Header, { actionsOnly: true }));