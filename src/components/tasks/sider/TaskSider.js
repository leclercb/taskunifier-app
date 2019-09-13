import React, { useState } from 'react';
import { Badge, Checkbox, Input, Menu, Radio, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import ObjectMenuItem from 'components/sider/ObjectMenuItem';
import Constants from 'constants/Constants';
import { createSearchTaskFilter, getGeneralTaskFilters } from 'data/DataTaskFilters';
import { useAppApi } from 'hooks/UseAppApi';
import { useContextApi } from 'hooks/UseContextApi';
import { useFolderApi } from 'hooks/UseFolderApi';
import { useGoalApi } from 'hooks/UseGoalApi';
import { useLocationApi } from 'hooks/UseLocationApi';
import { useTagApi } from 'hooks/UseTagApi';
import { useTaskFilterApi } from 'hooks/UseTaskFilterApi';
import { useTaskApi } from 'hooks/UseTaskApi';

function TaskSider(props) {
    const appApi = useAppApi();
    const contextApi = useContextApi();
    const folderApi = useFolderApi();
    const goalApi = useGoalApi();
    const locationApi = useLocationApi();
    const tagApi = useTagApi();
    const taskApi = useTaskApi();
    const taskFilterApi = useTaskFilterApi();

    const [openKeys, setOpenKeys] = useState(['general']);

    const onSelect = event => {
        taskApi.setSelectedTaskFilter(event.item.props.filter);
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

    const manageObjects = category => {
        appApi.setCategoryManagerOptions({
            visible: true,
            category
        });
    };

    const editObject = (category, objectId) => {
        appApi.setCategoryManagerOptions({
            visible: true,
            category,
            objectId
        });
    };

    const dropObject = (task, object, property) => {
        taskApi.updateTask({
            ...task,
            [property]: object.id
        });
    };

    const manageTaskFilters = () => {
        appApi.setTaskFilterManagerOptions({
            visible: true
        });
    };

    const editTaskFilter = taskFilterId => {
        appApi.setTaskFilterManagerOptions({
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
        taskApi.setSelectedTaskFilter(createSearchTaskFilter(value));
    };

    const searchTaskFilter = createSearchTaskFilter();

    const createBadge = taskFilter => {
        if (taskFilter.id !== taskApi.selectedTaskFilter.id) {
            return null;
        }

        return (
            <Badge
                count={taskApi.filteredTasks.length}
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
                    checked={taskApi.showCompletedTasks}
                    onChange={() => taskApi.setShowCompletedTasks(!taskApi.showCompletedTasks)}
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
                        value={taskApi.calendarDateMode}
                        onChange={event => taskApi.setCalendarDateMode(event.target.value)}>
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
                selectedKeys={[taskApi.selectedTaskFilter.id]}
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
                    {folderApi.folders.map(folder => {
                        const filter = createTaskFilterForObject(folder, 'folder');

                        return (
                            <Menu.Item key={folder.id} filter={filter}>
                                <ObjectMenuItem
                                    badge={createBadge(filter)}
                                    object={folder}
                                    onManage={() => manageObjects('folders')}
                                    onEdit={() => editObject('folders', folder.id)}
                                    onDelete={() => folderApi.deleteFolder(folder.id)}
                                    dropType="task"
                                    onDrop={(task, folder) => dropObject(task, folder, 'folder')} />
                            </Menu.Item>
                        );
                    })}
                </Menu.SubMenu>
                <Menu.SubMenu
                    key="contexts"
                    title={createCategorySubMenu('Contexts', 'thumbtack', () => manageObjects('contexts'), () => onOpenChange('contexts'))}>
                    {contextApi.contexts.map(context => {
                        const filter = createTaskFilterForObject(context, 'context');

                        return (
                            <Menu.Item key={context.id} filter={filter}>
                                <ObjectMenuItem
                                    badge={createBadge(filter)}
                                    object={context}
                                    onManage={() => manageObjects('contexts')}
                                    onEdit={() => editObject('contexts', context.id)}
                                    onDelete={() => contextApi.deleteContext(context.id)}
                                    dropType="task"
                                    onDrop={(task, context) => dropObject(task, context, 'context')} />
                            </Menu.Item>
                        );
                    })}
                </Menu.SubMenu>
                <Menu.SubMenu
                    key="goals"
                    title={createCategorySubMenu('Goals', 'bullseye', () => manageObjects('goals'), () => onOpenChange('goals'))}>
                    {goalApi.goals.map(goal => {
                        const filter = createTaskFilterForObject(goal, 'goal');

                        return (
                            <Menu.Item key={goal.id} filter={filter}>
                                <ObjectMenuItem
                                    badge={createBadge(filter)}
                                    object={goal}
                                    onManage={() => manageObjects('goals')}
                                    onEdit={() => editObject('goals', goal.id)}
                                    onDelete={() => goalApi.deleteGoal(goal.id)}
                                    dropType="task"
                                    onDrop={(task, goal) => dropObject(task, goal, 'goal')} />
                            </Menu.Item>
                        );
                    })}
                </Menu.SubMenu>
                <Menu.SubMenu
                    key="locations"
                    title={createCategorySubMenu('Locations', 'compass', () => manageObjects('locations'), () => onOpenChange('locations'))}>
                    {locationApi.locations.map(location => {
                        const filter = createTaskFilterForObject(location, 'location');

                        return (
                            <Menu.Item key={location.id} filter={filter}>
                                <ObjectMenuItem
                                    badge={createBadge(filter)}
                                    object={location}
                                    onManage={() => manageObjects('locations')}
                                    onEdit={() => editObject('locations', location.id)}
                                    onDelete={() => locationApi.deleteLocation(location.id)}
                                    dropType="task"
                                    onDrop={(task, location) => dropObject(task, location, 'location')} />
                            </Menu.Item>
                        );
                    })}
                </Menu.SubMenu>
                <Menu.SubMenu
                    key="tags"
                    title={createCategorySubMenu('Tags', 'tag', () => manageObjects('tags'), () => onOpenChange('tags'))}>
                    {tagApi.tags.map(tag => {
                        const filter = createTaskFilterForObject(tag, 'tags', {
                            id: '1',
                            field: 'tags',
                            type: 'contain',
                            value: [tag.id]
                        });

                        return (
                            <Menu.Item key={tag.id} filter={filter}>
                                <ObjectMenuItem
                                    badge={createBadge(filter)}
                                    object={tag}
                                    onManage={() => manageObjects('tags')}
                                    onEdit={() => editObject('tags', tag.id)}
                                    onDelete={() => tagApi.deleteTag(tag.id)} />
                            </Menu.Item>
                        );
                    })}
                </Menu.SubMenu>
                <Menu.SubMenu
                    key="taskFilters"
                    title={createCategorySubMenu('Task Filters', 'filter', () => manageTaskFilters(), () => onOpenChange('taskFilters'))}>
                    {taskFilterApi.taskFilters.map(taskFilter => (
                        <Menu.Item key={taskFilter.id} filter={taskFilter}>
                            <ObjectMenuItem
                                badge={createBadge(taskFilter)}
                                object={taskFilter}
                                onManage={() => manageTaskFilters()}
                                onEdit={() => editTaskFilter(taskFilter.id)}
                                onDelete={() => taskFilterApi.deleteTaskFilter(taskFilter.id)} />
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>
            </Menu >
        </div>
    );
}

TaskSider.propTypes = {
    mode: PropTypes.oneOf(['table', 'calendar']).isRequired
};

export default TaskSider;