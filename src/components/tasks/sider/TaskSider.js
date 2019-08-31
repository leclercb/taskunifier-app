import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Badge, Checkbox, Input, Menu, Popconfirm, Radio, Tooltip } from 'antd';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import Spacer from 'components/common/Spacer';
import TaskMenu from 'components/tasks/sider/TaskMenu';
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

    const onOpenChange = key => {
        const newOpenKeys = [...openKeys];

        if (newOpenKeys.includes(key)) {
            newOpenKeys.splice(newOpenKeys.indexOf(key), 1);
        } else {
            newOpenKeys.push(key);
        }

        setOpenKeys(newOpenKeys);
    };

    const createCategorySubMenu = (text, icon, onManage, onOpenChange) => {
        return (
            <LeftRight
                onClickLeft={onOpenChange}
                right={onManage ? (
                    <Icon
                        icon="cubes"
                        color={Constants.fadeIconColor}
                        className="object-actions"
                        onClick={() => onManage()} />
                ) : null}>
                <Icon icon={icon} text={text} />
            </LeftRight>
        );
    };

    const createEditDeleteButtons = (object, onEdit, onDelete) => {
        return (
            <React.Fragment>
                <Icon
                    icon="edit"
                    color={Constants.fadeIconColor}
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
                        color={Constants.fadeIconColor}
                        className="object-actions" />
                </Popconfirm>
            </React.Fragment>
        );
    };

    const createObjectMenuItem = (object, taskFilter, onManage, onEdit, onDelete) => {
        const onAction = action => {
            switch (action.type) {
                case 'edit':
                    onEdit();
                    break;
                case 'manage':
                    onManage();
                    break;
                default:
                    break;
            }
        };

        return (
            <Menu.Item key={object.id} filter={taskFilter}>
                <TaskMenu onAction={onAction}>
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
                </TaskMenu>
            </Menu.Item>
        );
    };

    const manageObjects = category => {
        props.setCategoryManagerOptions({
            visible: true,
            category
        });
    };

    const editObject = (category, objectId) => {
        props.setCategoryManagerOptions({
            visible: true,
            category,
            objectId
        });
    };

    const manageTaskFilters = () => {
        props.setTaskFilterManagerOptions({
            visible: true
        });
    };

    const editTaskFilter = taskFilterId => {
        props.setTaskFilterManagerOptions({
            visible: true,
            taskFilterId
        });
    };

    const createTaskFilterForObject = (object, field, condition = {
        id: null,
        field,
        type: 'equal',
        value: object.id
    }) => {
        return {
            id: object.id,
            title: object.title,
            color: object.color,
            condition
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

        return (
            <Badge
                count={props.taskNumber}
                showZero={true}
                overflowCount={9999}
                style={{
                    backgroundColor: Constants.badgeColor,
                    fontWeight: 'bold',
                    marginLeft: 10,
                    marginBottom: 2
                }} />
        );
    };

    return (
        <div
            className="joyride-task-sider"
            style={{ backgroundColor: '#ffffff', height: '100%' }}>
            {props.mode === 'table' ? (
                <Checkbox
                    checked={props.showCompletedTasks}
                    onChange={() => props.setShowCompletedTasks(!props.showCompletedTasks)}
                    style={{
                        padding: 10,
                        paddingBottom: 20
                    }}>
                    Show completed tasks
                </Checkbox>
            ) : null}
            {props.mode === 'calendar' ? (
                <div style={{
                    padding: 10,
                    paddingBottom: 20
                }}>
                    <div style={{ marginBottom: 10 }}>Show tasks by:</div>
                    <Radio.Group
                        value={props.calendarDateMode}
                        onChange={event => props.setCalendarDateMode(event.target.value)}>
                        <Radio
                            value="both"
                            style={{
                                borderTop: `1px solid ${Constants.calendarDateModeColor_startDate}`,
                                borderLeft: `1px solid ${Constants.calendarDateModeColor_startDate}`,
                                borderBottom: `1px solid ${Constants.calendarDateModeColor_dueDate}`,
                                borderRight: `1px solid ${Constants.calendarDateModeColor_dueDate}`,
                                borderRadius: 10,
                                padding: 3
                            }}>
                            Both
                        </Radio>
                        <Radio
                            value="startDate"
                            style={{
                                border: `1px solid ${Constants.calendarDateModeColor_startDate}`,
                                borderRadius: 10,
                                padding: 3
                            }}>
                            Start date
                        </Radio>
                        <Radio
                            value="dueDate"
                            style={{
                                border: `1px solid ${Constants.calendarDateModeColor_dueDate}`,
                                borderRadius: 10,
                                padding: 3
                            }}>
                            Due date
                        </Radio>
                    </Radio.Group>
                </div>
            ) : null}
            <Menu
                selectedKeys={[props.selectedTaskFilter.id]}
                openKeys={openKeys}
                onSelect={onSelect}
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
                <Menu.SubMenu
                    key="general"
                    title={<Icon icon="home" text="General" />}
                    onTitleClick={({ key }) => onOpenChange(key)}>
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
                <Menu.SubMenu
                    key="folders"
                    title={createCategorySubMenu('Folders', 'folder', () => manageObjects('folders'), () => onOpenChange('folders'))}>
                    {props.folders.map(folder => createObjectMenuItem(
                        folder,
                        createTaskFilterForObject(folder, 'folder'),
                        () => manageObjects('folders'),
                        () => editObject('folders', folder.id),
                        () => props.deleteFolder(folder.id)))}
                </Menu.SubMenu>
                <Menu.SubMenu
                    key="contexts"
                    title={createCategorySubMenu('Contexts', 'thumbtack', () => manageObjects('contexts'), () => onOpenChange('contexts'))}>
                    {props.contexts.map(context => createObjectMenuItem(
                        context,
                        createTaskFilterForObject(context, 'context'),
                        () => manageObjects('contexts'),
                        () => editObject('contexts', context.id),
                        () => props.deleteContext(context.id)))}
                </Menu.SubMenu>
                <Menu.SubMenu
                    key="goals"
                    title={createCategorySubMenu('Goals', 'bullseye', () => manageObjects('goals'), () => onOpenChange('goals'))}>
                    {props.goals.map(goal => createObjectMenuItem(
                        goal,
                        createTaskFilterForObject(goal, 'goal'),
                        () => manageObjects('goals'),
                        () => editObject('goals', goal.id),
                        () => props.deleteGoal(goal.id)))}
                </Menu.SubMenu>
                <Menu.SubMenu
                    key="locations"
                    title={createCategorySubMenu('Locations', 'compass', () => manageObjects('locations'), () => onOpenChange('locations'))}>
                    {props.locations.map(location => createObjectMenuItem(
                        location,
                        createTaskFilterForObject(location, 'location'),
                        () => manageObjects('locations'),
                        () => editObject('locations', location.id),
                        () => props.deleteLocation(location.id)))}
                </Menu.SubMenu>
                <Menu.SubMenu
                    key="tags"
                    title={createCategorySubMenu('Tags', 'tag', null, () => onOpenChange('tags'))}>
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
                <Menu.SubMenu
                    key="taskFilters"
                    title={createCategorySubMenu('Task Filters', 'filter', () => manageTaskFilters(), () => onOpenChange('taskFilters'))}>
                    {props.taskFilters.map(taskFilter => createObjectMenuItem(
                        taskFilter,
                        taskFilter,
                        () => manageTaskFilters(),
                        () => editTaskFilter(taskFilter.id),
                        () => props.deleteTaskFilter(taskFilter.id)))}
                </Menu.SubMenu>
            </Menu >
        </div>
    );
}

TaskSider.propTypes = {
    mode: PropTypes.oneOf(['table', 'calendar']).isRequired,
    contexts: PropTypes.arrayOf(ContextPropType.isRequired).isRequired,
    folders: PropTypes.arrayOf(FolderPropType.isRequired).isRequired,
    goals: PropTypes.arrayOf(GoalPropType.isRequired).isRequired,
    locations: PropTypes.arrayOf(LocationPropType.isRequired).isRequired,
    tags: PropTypes.arrayOf(TagPropType.isRequired).isRequired,
    taskFilters: PropTypes.arrayOf(TaskFilterPropType.isRequired).isRequired,
    taskNumber: PropTypes.number.isRequired,
    showCompletedTasks: PropTypes.bool.isRequired,
    calendarDateMode: PropTypes.oneOf(['both', 'startDate', 'dueDate']).isRequired,
    selectedTaskFilter: TaskFilterPropType.isRequired,
    setShowCompletedTasks: PropTypes.func.isRequired,
    setCalendarDateMode: PropTypes.func.isRequired,
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
    includeCalendarDateMode: true,
    includeSelectedTaskFilter: true,
    includeTaskNumber: true,
    filteredByNonArchivedFolders: true,
    filteredByNonArchivedGoals: true
}));