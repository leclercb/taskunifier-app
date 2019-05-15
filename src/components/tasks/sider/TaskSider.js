import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Badge, Checkbox, Input, Menu, Popconfirm, Tooltip } from 'antd';
import { Item as RCItem, Menu as RCMenu, MenuProvider as RCMenuProvider } from 'react-contexify';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import Spacer from 'components/common/Spacer';
import Constants from 'constants/Constants';
import withApp from 'containers/WithApp';
import withObjects from 'containers/WithObjects';
import { createSearchTaskFilter, getGeneralTaskFilters } from 'data/DataTaskFilters';
import { ContextPropType } from 'proptypes/ContextPropTypes';
import { FolderPropType } from 'proptypes/FolderPropTypes';
import { GoalPropType } from 'proptypes/GoalPropTypes';
import { LocationPropType } from 'proptypes/LocationPropTypes';
import { TagPropType } from 'proptypes/TagPropTypes';
import { TaskFilterPropType } from 'proptypes/TaskFilterPropTypes';

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

    const createObjectContextMenu = (object, onAdd, onEdit) => {
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
                        <LeftRight right={(
                            <React.Fragment>
                                {createEditDeleteButtons(object, onEdit, onDelete)}
                                {createBadge(taskFilter)}
                            </React.Fragment>
                        )}>
                            <Icon icon="circle" color={object.color} text={object.title} />
                        </LeftRight>
                    </div>
                </RCMenuProvider>
                {createObjectContextMenu(object, onAdd, onEdit)}
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
        id: null,
        field: field,
        type: 'equal',
        value: object.id
    }) => {
        return {
            id: object.id,
            title: object.title,
            color: object.color,
            condition: condition
        };
    };

    const onSearch = value => {
        props.setSelectedTaskFilter(createSearchTaskFilter(value));
    };

    const searchTaskFilter = createSearchTaskFilter();

    const createBadge = taskFilter => {
        if (taskFilter.id !== props.selectedTaskFilter.id) {
            return null;
        }

        return <Badge
            count={props.taskNumber}
            showZero={true}
            overflowCount={9999}
            style={{
                backgroundColor: Constants.badgeColor,
                fontWeight: 'bold',
                marginLeft: 10,
                marginBottom: 2
            }} />;
    };

    return (
        <div style={{ backgroundColor: '#ffffff', height: '100%' }}>
            <Checkbox
                checked={props.showCompletedTasks}
                onChange={() => props.setShowCompletedTasks(!props.showCompletedTasks)}
                style={{
                    margin: 10,
                    marginBottom: 20
                }}>
                Show completed tasks
            </Checkbox>
            <Menu
                selectedKeys={[props.selectedTaskFilter.id]}
                openKeys={openKeys}
                onSelect={onSelect}
                onOpenChange={onOpenChange}
                mode="inline">
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
                            <LeftRight right={createBadge(taskFilter)}>
                                <Icon
                                    icon={taskFilter.icon}
                                    color={taskFilter.color}
                                    text={taskFilter.title} />
                            </LeftRight>
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
                            value: [tag.id]
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
        </div>
    );
}

TaskSider.propTypes = {
    contexts: PropTypes.arrayOf(ContextPropType.isRequired).isRequired,
    folders: PropTypes.arrayOf(FolderPropType.isRequired).isRequired,
    goals: PropTypes.arrayOf(GoalPropType.isRequired).isRequired,
    locations: PropTypes.arrayOf(LocationPropType.isRequired).isRequired,
    tags: PropTypes.arrayOf(TagPropType.isRequired).isRequired,
    taskFilters: PropTypes.arrayOf(TaskFilterPropType.isRequired).isRequired,
    taskNumber: PropTypes.number.isRequired,
    showCompletedTasks: PropTypes.bool.isRequired,
    selectedTaskFilter: TaskFilterPropType.isRequired,
    setShowCompletedTasks: PropTypes.func.isRequired,
    setSelectedTaskFilter: PropTypes.func.isRequired,
    setCategoryManagerOptions: PropTypes.func.isRequired,
    setTaskFilterManagerOptions: PropTypes.func.isRequired,
    deleteContext: PropTypes.func.isRequired,
    deleteFolder: PropTypes.func.isRequired,
    deleteGoal: PropTypes.func.isRequired,
    deleteLocation: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired,
    deleteTaskFilter: PropTypes.func.isRequired
};

export default withApp(withObjects(TaskSider, {
    includeDispatch: true,
    includeContexts: true,
    includeFolders: true,
    includeGoals: true,
    includeLocations: true,
    includeTags: true,
    includeTaskFilters: true,
    includeShowCompletedTasks: true,
    includeSelectedTaskFilter: true,
    includeTaskNumber: true,
    filteredByNonArchivedFolders: true,
    filteredByNonArchivedGoals: true
}));