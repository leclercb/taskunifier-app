import React, { useState } from 'react';
import { Alert, Badge, Checkbox, Input, Menu, Switch, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import ObjectMenuItem from 'components/sider/ObjectMenuItem';
import ModalTaskFilterInfo from 'components/taskfilters/ModalTaskFilterInfo';
import Constants from 'constants/Constants';
import { getGeneralTaskFilters } from 'data/DataTaskFilters';
import { useAppApi } from 'hooks/UseAppApi';
import { useContextApi } from 'hooks/UseContextApi';
import { useFolderApi } from 'hooks/UseFolderApi';
import { useGoalApi } from 'hooks/UseGoalApi';
import { useLocationApi } from 'hooks/UseLocationApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTagApi } from 'hooks/UseTagApi';
import { useTaskFilterApi } from 'hooks/UseTaskFilterApi';
import { useTaskApi } from 'hooks/UseTaskApi';
import { equals } from 'utils/ObjectUtils';

function TaskSider(props) {
    const appApi = useAppApi();
    const contextApi = useContextApi();
    const folderApi = useFolderApi();
    const goalApi = useGoalApi();
    const locationApi = useLocationApi();
    const settingsApi = useSettingsApi();
    const tagApi = useTagApi();
    const taskApi = useTaskApi();
    const taskFilterApi = useTaskFilterApi();

    const [searchValue, setSearchValue] = useState(taskApi.searchTaskValue);
    const [selectedTaskFilterInfo, setSelectedTaskFilterInfo] = useState(null);

    const openKeys = settingsApi.settings.taskSiderOpenKeys;

    const setOpenKeys = openKeys => {
        settingsApi.updateSettings({
            taskSiderOpenKeys: openKeys
        });
    };

    const onSelect = event => {
        taskApi.setSelectedTaskFilterDefinition(event.item.props.filterdef);
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

    const createBadge = filterId => {
        if (!settingsApi.settings.showAllBadgeCounts && filterId !== taskApi.selectedTaskFilter.id) {
            return null;
        }

        let count = 0;

        if (filterId === taskApi.selectedTaskFilter.id) {
            count = taskApi.filteredTasks.length;
        } else {
            if (!(filterId in taskFilterApi.taskFilterCounts)) {
                return null;
            }

            count = taskFilterApi.taskFilterCounts[filterId] || 0;
        }

        return (
            <Badge
                count={count}
                showZero={true}
                overflowCount={9999}
                style={{
                    backgroundColor: filterId === taskApi.selectedTaskFilter.id ? Constants.badgeColor : Constants.inactiveBadgeColor,
                    fontWeight: 'bold',
                    marginRight: 5,
                    marginBottom: 2
                }} />
        );
    };

    const containsFilterDefinition = filterDefinition => {
        const definitions = settingsApi.settings.combinedTaskFilterDefinitions || [];
        return !!definitions.find(definition => equals(definition, filterDefinition));
    };

    const updateCombinedFilterDefinitions = filterDefinition => {
        let definitions = [...(settingsApi.settings.combinedTaskFilterDefinitions || [])];
        const index = definitions.findIndex(definition => equals(definition, filterDefinition));

        if (index >= 0) {
            definitions.splice(index, 1);
        } else {
            definitions.push(filterDefinition);
        }

        settingsApi.updateSettings({
            combinedTaskFilterDefinitions: definitions
        });
    };

    const combinedFilterDefinitionNumber = (settingsApi.settings.combinedTaskFilterDefinitions || []).length;

    return (
        <React.Fragment>
            <ModalTaskFilterInfo
                taskFilter={selectedTaskFilterInfo}
                visible={!!selectedTaskFilterInfo}
                onClose={() => setSelectedTaskFilterInfo(null)} />
            <div
                className="joyride-task-sider"
                style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', minHeight: '100%' }}>
                {props.mode === 'table' && (
                    <div style={{ padding: '10px 10px 0px 10px' }}>
                        <div>
                            <Checkbox
                                checked={taskApi.showTaskHierarchy}
                                onChange={() => taskApi.setShowTaskHierarchy(!taskApi.showTaskHierarchy)}>
                                Show task indentation
                            </Checkbox>
                        </div>
                        <div style={{ paddingTop: 3 }}>
                            <Checkbox
                                checked={taskApi.showCompletedTasks}
                                onChange={() => taskApi.setShowCompletedTasks(!taskApi.showCompletedTasks)}>
                                Show completed tasks
                            </Checkbox>
                        </div>
                        <div style={{ paddingTop: 3 }}>
                            <Checkbox
                                checked={taskApi.showFutureTasks}
                                onChange={() => taskApi.setShowFutureTasks(!taskApi.showFutureTasks)}>
                                Show future tasks
                            </Checkbox>
                        </div>
                    </div>
                )}
                {props.mode === 'calendar' && (
                    <div style={{ padding: 10 }}>
                        <div style={{ marginBottom: 5 }}>Show following event types:</div>
                        <Checkbox.Group
                            value={taskApi.calendarEventTypes}
                            options={[
                                {
                                    label: (<span style={{ border: '1px solid ' + Constants.calendarEventTypeColor_startDate, borderRadius: 5, padding: 2 }}>Start Date</span>),
                                    value: 'startDate'
                                },
                                {
                                    label: (<span style={{ border: '1px solid ' + Constants.calendarEventTypeColor_dueDate, borderRadius: 5, padding: 2 }}>Due Date</span>),
                                    value: 'dueDate'
                                },
                                {
                                    label: (<span style={{ border: '1px solid ' + Constants.calendarEventTypeColor_workLog, borderRadius: 5, padding: 2 }}>Work Log</span>),
                                    value: 'workLog'
                                }
                            ]}
                            onChange={types => taskApi.setCalendarEventTypes(types)} />
                    </div>
                )}
                <div style={{ padding: 10 }}>
                    <Icon
                        icon="search"
                        text={(
                            <Tooltip title="Press enter to search" placement="bottom">
                                <Input.Search
                                    value={searchValue}
                                    allowClear={true}
                                    size="small"
                                    placeholder="Search for ..."
                                    style={{ width: '90%' }}
                                    onChange={event => setSearchValue(event.target.value)}
                                    onSearch={value => taskApi.setSearchTaskValue(value)}
                                    onKeyDown={event => {
                                        if (event.key === 'Escape') {
                                            setSearchValue('');
                                            taskApi.setSearchTaskValue('');
                                        }
                                    }} />
                            </Tooltip>
                        )} />
                </div>
                <Menu
                    selectedKeys={[taskApi.selectedTaskFilter.id]}
                    openKeys={openKeys}
                    onSelect={onSelect}
                    mode="inline"
                    style={{ flex: 1 }}>
                    <Menu.SubMenu
                        key="general"
                        title={<Icon icon="home" text="General" />}
                        onTitleClick={({ key }) => onOpenChange(key)}>
                        {getGeneralTaskFilters().filter(filter => settingsApi.settings['taskFilterVisible_' + filter.id] !== false).map(filter => {
                            const filterDefinition = { id: filter.id, type: 'general' };

                            return (
                                <Menu.Item
                                    key={filter.id}
                                    filterdef={filterDefinition}>
                                    <LeftRight right={(
                                        <React.Fragment>
                                            {createBadge(filter.id)}
                                            <Icon
                                                icon="info-circle"
                                                color={Constants.fadeIconColor}
                                                className="object-actions"
                                                onClick={() => setSelectedTaskFilterInfo(filter)} />
                                            <Switch
                                                checked={containsFilterDefinition(filterDefinition)}
                                                onChange={() => updateCombinedFilterDefinitions(filterDefinition)}
                                                size="small"
                                                style={{ marginLeft: 5 }} />
                                        </React.Fragment>
                                    )}>
                                        <Icon
                                            icon={filter.icon}
                                            color={filter.color}
                                            text={filter.title} />
                                    </LeftRight>
                                </Menu.Item>
                            );
                        })}
                        {taskFilterApi.taskFilters.filter(filter => filter.directory === 'general').map(filter => {
                            const filterDefinition = { id: filter.id, type: 'default' };

                            return (
                                <Menu.Item key={filter.id} filterdef={filterDefinition}>
                                    <ObjectMenuItem
                                        badge={createBadge(filter.id)}
                                        object={filter}
                                        isCombinedFilter={containsFilterDefinition(filterDefinition)}
                                        onCombineFilter={() => updateCombinedFilterDefinitions(filterDefinition)}
                                        onManage={() => manageTaskFilters()}
                                        onEdit={() => editTaskFilter(filter.id)}
                                        onDelete={() => taskFilterApi.deleteTaskFilter(filter.id)} />
                                </Menu.Item>
                            );
                        })}
                    </Menu.SubMenu>
                    <Menu.SubMenu
                        key="folders"
                        title={createCategorySubMenu('Folders', 'folder', () => manageObjects('folders'), () => onOpenChange('folders'))}>
                        {folderApi.nonArchivedFolders.map(folder => {
                            const filterDefinition = { id: folder.id, type: 'folder' };

                            return (
                                <Menu.Item key={folder.id} filterdef={filterDefinition}>
                                    <ObjectMenuItem
                                        badge={createBadge(folder.id)}
                                        object={folder}
                                        isCombinedFilter={containsFilterDefinition(filterDefinition)}
                                        onCombineFilter={() => updateCombinedFilterDefinitions(filterDefinition)}
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
                            const filterDefinition = { id: context.id, type: 'context' };

                            return (
                                <Menu.Item key={context.id} filterdef={filterDefinition}>
                                    <ObjectMenuItem
                                        badge={createBadge(context.id)}
                                        object={context}
                                        isCombinedFilter={containsFilterDefinition(filterDefinition)}
                                        onCombineFilter={() => updateCombinedFilterDefinitions(filterDefinition)}
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
                        {goalApi.nonArchivedGoals.map(goal => {
                            const filterDefinition = { id: goal.id, type: 'goal' };

                            return (
                                <Menu.Item key={goal.id} filterdef={filterDefinition}>
                                    <ObjectMenuItem
                                        badge={createBadge(goal.id)}
                                        object={goal}
                                        isCombinedFilter={containsFilterDefinition(filterDefinition)}
                                        onCombineFilter={() => updateCombinedFilterDefinitions(filterDefinition)}
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
                            const filterDefinition = { id: location.id, type: 'location' };

                            return (
                                <Menu.Item key={location.id} filterdef={filterDefinition}>
                                    <ObjectMenuItem
                                        badge={createBadge(location.id)}
                                        object={location}
                                        isCombinedFilter={containsFilterDefinition(filterDefinition)}
                                        onCombineFilter={() => updateCombinedFilterDefinitions(filterDefinition)}
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
                            const filterDefinition = { id: tag.id, type: 'tags' };

                            return (
                                <Menu.Item key={tag.id} filterdef={filterDefinition}>
                                    <ObjectMenuItem
                                        badge={createBadge(tag.id)}
                                        object={tag}
                                        isCombinedFilter={containsFilterDefinition(filterDefinition)}
                                        onCombineFilter={() => updateCombinedFilterDefinitions(filterDefinition)}
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
                        {taskFilterApi.taskFilters.filter(filter => filter.directory !== 'general').map(filter => {
                            const filterDefinition = { id: filter.id, type: 'default' };

                            return (
                                <Menu.Item key={filter.id} filterdef={filterDefinition}>
                                    <ObjectMenuItem
                                        badge={createBadge(filter.id)}
                                        object={filter}
                                        isCombinedFilter={containsFilterDefinition(filterDefinition)}
                                        onCombineFilter={() => updateCombinedFilterDefinitions(filterDefinition)}
                                        onManage={() => manageTaskFilters()}
                                        onEdit={() => editTaskFilter(filter.id)}
                                        onDelete={() => taskFilterApi.deleteTaskFilter(filter.id)} />
                                </Menu.Item>
                            );
                        })}
                    </Menu.SubMenu>
                </Menu>
                {combinedFilterDefinitionNumber > 0 && (
                    <Alert
                        type="info"
                        showIcon
                        message={`${combinedFilterDefinitionNumber} combined filter${combinedFilterDefinitionNumber > 1 ? 's' : ''}`}
                        style={{ margin: 10 }} />
                )}
            </div>
        </React.Fragment>
    );
}

TaskSider.propTypes = {
    mode: PropTypes.oneOf(['table', 'calendar']).isRequired
};

export default TaskSider;