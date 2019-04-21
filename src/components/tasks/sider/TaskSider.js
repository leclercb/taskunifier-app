import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Menu, Popconfirm } from 'antd';
import Icon from '../../common/Icon';
import withObjects from '../../../containers/WithObjects';
import withApp from '../../../containers/WithApp';
import { ContextPropType } from '../../../proptypes/ContextPropTypes';
import { FolderPropType } from '../../../proptypes/FolderPropTypes';
import { GoalPropType } from '../../../proptypes/GoalPropTypes';
import { LocationPropType } from '../../../proptypes/LocationPropTypes';
import { TaskFilterPropType } from '../../../proptypes/TaskFilterPropTypes';
import LeftRight from '../../common/LeftRight';
import Constants from '../../../constants/Constants';
import { Menu as RCMenu, Item as RCItem, MenuProvider as RCMenuProvider } from 'react-contexify';
import { getGeneralTaskFilters, createSearchTaskFilter } from '../../../data/DataTaskFilters';
import { Tooltip } from 'antd';
import Spacer from '../../common/Spacer';

function TaskSider(props) {
    const [openKeys, setOpenKeys] = useState(['general']);

    const onSelect = event => {
        props.setSelectedTaskFilter(event.item.props.filter);
    };

    const onOpenChange = keys => {
        setOpenKeys(keys);
    };

    const createCategorySubMenu = (text, icon, onAdd) => {
        return (
            <LeftRight right={onAdd ? (
                <Icon
                    icon="plus"
                    color={Constants.fadeColor}
                    className="object-actions"
                    onClick={() => onAdd()} />
            ) : null}>
                <Icon icon={icon} text={text} />
            </LeftRight>
        );
    };

    const createObjectContextMenu = (object, onAdd, onEdit, onDelete) => {
        return (
            <RCMenu id={'menu_' + object.id}>
                {onAdd ? (
                    <RCItem onClick={() => onAdd()}>
                        <Icon icon="plus" text="Add" />
                    </RCItem>
                ) : null}
                {onEdit ? (
                    <RCItem onClick={() => onEdit()}>
                        <Icon icon="edit" text="Edit" />
                    </RCItem>
                ) : null}
            </RCMenu>
        );
    };

    const createEditDeleteButtons = (object, onEdit, onDelete) => {
        return (
            <React.Fragment>
                <Icon
                    icon="edit"
                    color={Constants.fadeColor}
                    className="object-actions"
                    onClick={() => onEdit()} />
                <Spacer />
                <Popconfirm
                    title={`Do you really want to delete "${object.title}" ?`}
                    onConfirm={() => onDelete()}
                    okText="Yes"
                    cancelText="No">
                    <Icon
                        icon="trash-alt"
                        color={Constants.fadeColor}
                        className="object-actions" />
                </Popconfirm>
            </React.Fragment>
        );
    };

    const createObjectMenuItem = (object, taskFilter, onAdd, onEdit, onDelete) => {
        return (
            <Menu.Item key={object.id} filter={taskFilter}>
                <RCMenuProvider id={'menu_' + object.id}>
                    <div>
                        <LeftRight right={createEditDeleteButtons(object, onEdit, onDelete)}>
                            <Icon icon="circle" color={object.color} text={object.title} />
                        </LeftRight>
                    </div>
                </RCMenuProvider>
                {createObjectContextMenu(object, onAdd, onEdit, onDelete)}
            </Menu.Item>
        );
    };

    const addObject = category => {
        props.setCategoryManagerOptions({
            visible: true,
            category: category
        });
    };

    const editObject = (category, objectId) => {
        props.setCategoryManagerOptions({
            visible: true,
            category: category,
            objectId: objectId
        });
    };

    const addTaskFilter = () => {
        props.setTaskFilterManagerOptions({
            visible: true
        });
    };

    const editTaskFilter = taskFilterId => {
        props.setTaskFilterManagerOptions({
            visible: true,
            taskFilterId: taskFilterId
        });
    };

    const createTaskFilterForObject = (object, field, condition = {
        id: '1',
        field: field,
        type: 'equal',
        value: object.id
    }) => {
        return {
            id: object.id,
            title: object.title,
            color: object.color,
            condition: condition
        }
    };

    const onSearch = value => {
        props.setSelectedTaskFilter(createSearchTaskFilter(value));
    };

    const searchTaskFilter = createSearchTaskFilter();

    return (
        <React.Fragment>
            <Menu
                selectedKeys={[props.selectedTaskFilter.id]}
                openKeys={openKeys}
                onSelect={onSelect}
                onOpenChange={onOpenChange}
                mode="inline"
                style={{ height: '100%' }}>
                <Menu.Item
                    key={searchTaskFilter.id}
                    filter={searchTaskFilter}>
                    <Icon
                        icon={searchTaskFilter.icon}
                        text={(
                            <Tooltip title="Press enter to search" placement="bottom">
                                <Input.Search
                                    allowClear={true}
                                    size="small"
                                    placeholder="Search for ..."
                                    style={{ width: '80%' }}
                                    onSearch={value => onSearch(value)} />
                            </Tooltip>
                        )} />
                </Menu.Item>
                <Menu.SubMenu key="general" title={<Icon icon="home" text="General" />}>
                    {getGeneralTaskFilters().map(taskFilter => (
                        <Menu.Item
                            key={taskFilter.id}
                            filter={taskFilter}>
                            <Icon
                                icon={taskFilter.icon}
                                color={taskFilter.color}
                                text={taskFilter.title} />
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>
                <Menu.SubMenu key="folders" title={createCategorySubMenu('Folders', 'folder', () => addObject('folders'))}>
                    {props.folders.map(folder => createObjectMenuItem(
                        folder,
                        createTaskFilterForObject(folder, 'folder'),
                        () => addObject('folders'),
                        () => editObject('folders', folder.id),
                        () => props.deleteFolder(folder.id)))}
                </Menu.SubMenu>
                <Menu.SubMenu key="contexts" title={createCategorySubMenu('Contexts', 'thumbtack', () => addObject('contexts'))}>
                    {props.contexts.map(context => createObjectMenuItem(
                        context,
                        createTaskFilterForObject(context, 'context'),
                        () => addObject('contexts'),
                        () => editObject('contexts', context.id),
                        () => props.deleteContext(context.id)))}
                </Menu.SubMenu>
                <Menu.SubMenu key="goals" title={createCategorySubMenu('Goals', 'bullseye', () => addObject('goals'))}>
                    {props.goals.map(goal => createObjectMenuItem(
                        goal,
                        createTaskFilterForObject(goal, 'goal'),
                        () => addObject('goals'),
                        () => editObject('goals', goal.id),
                        () => props.deleteGoal(goal.id)))}
                </Menu.SubMenu>
                <Menu.SubMenu key="locations" title={createCategorySubMenu('Locations', 'compass', () => addObject('locations'))}>
                    {props.locations.map(location => createObjectMenuItem(
                        location,
                        createTaskFilterForObject(location, 'location'),
                        () => addObject('locations'),
                        () => editObject('locations', location.id),
                        () => props.deleteLocation(location.id)))}
                </Menu.SubMenu>
                <Menu.SubMenu key="tags" title={createCategorySubMenu('Tags', 'tag', null)}>
                    {props.tags.map(tag => createObjectMenuItem(
                        tag,
                        createTaskFilterForObject(tag, 'tags', {
                            id: '1',
                            field: 'tags',
                            type: 'contain',
                            value: tag.id
                        }),
                        null,
                        () => editObject('tags', tag.id),
                        () => props.deleteTag(tag.id)))}
                </Menu.SubMenu>
                <Menu.SubMenu key="taskFilters" title={createCategorySubMenu('Task Filters', 'filter', () => addTaskFilter())}>
                    {props.taskFilters.map(taskFilter => createObjectMenuItem(
                        taskFilter,
                        taskFilter,
                        () => addTaskFilter(),
                        () => editTaskFilter(taskFilter.id),
                        () => props.deleteTaskFilter(taskFilter.id)))}
                </Menu.SubMenu>
            </Menu >
        </React.Fragment>
    );
}

TaskSider.propTypes = {
    selectedTaskFilter: TaskFilterPropType.isRequired,
    contexts: PropTypes.arrayOf(ContextPropType).isRequired,
    folders: PropTypes.arrayOf(FolderPropType).isRequired,
    goals: PropTypes.arrayOf(GoalPropType).isRequired,
    locations: PropTypes.arrayOf(LocationPropType).isRequired,
    taskFilters: PropTypes.arrayOf(TaskFilterPropType).isRequired,
    setSelectedTaskFilter: PropTypes.func.isRequired,
    setCategoryManagerOptions: PropTypes.func.isRequired,
    setTaskFilterManagerOptions: PropTypes.func.isRequired,
    deleteContext: PropTypes.func.isRequired,
    deleteFolder: PropTypes.func.isRequired,
    deleteGoal: PropTypes.func.isRequired,
    deleteLocation: PropTypes.func.isRequired,
    deleteTaskFilter: PropTypes.func.isRequired
};

export default withApp(withObjects(TaskSider, {
    includeActions: true,
    includeContexts: true,
    includeTaskFilters: true,
    includeFolders: true,
    includeGoals: true,
    includeLocations: true,
    includeTags: true,
    filterArchivedFolders: true,
    filterArchivedGoals: true
}));