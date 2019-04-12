import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Menu, Popconfirm } from 'antd';
import Icon from '../common/Icon';
import withContexts from '../../containers/WithContexts';
import withFilters from '../../containers/WithFilters';
import withFolders from '../../containers/WithFolders';
import withGoals from '../../containers/WithGoals';
import withLocations from '../../containers/WithLocations';
import withApp from '../../containers/WithApp';
import { ContextPropType } from '../../proptypes/ContextPropTypes';
import { FolderPropType } from '../../proptypes/FolderPropTypes';
import { GoalPropType } from '../../proptypes/GoalPropTypes';
import { LocationPropType } from '../../proptypes/LocationPropTypes';
import { FilterPropType } from '../../proptypes/FilterPropTypes';
import LeftRight from '../common/LeftRight';
import Constants from '../constants/Constants';
import { Menu as RCMenu, Item as RCItem, MenuProvider as RCMenuProvider } from 'react-contexify';
import { getGeneralFilters, getSearchFilter } from '../../data/DataFilters';
import { Tooltip } from 'antd';

function Sider(props) {
    const [openKeys, setOpenKeys] = useState(['general']);

    const onSelect = event => {
        props.setSelectedFilter(event.item.props.filter);
    };

    const onOpenChange = keys => {
        setOpenKeys(keys);
    };

    const createCategorySubMenu = (text, icon, onAdd) => {
        return (
            <LeftRight right={<Icon
                icon="plus"
                color={Constants.fadeColor}
                className="object-actions"
                onClick={() => onAdd()} />}>
                <Icon icon={icon} text={text} />
            </LeftRight>
        );
    }

    const createObjectContextMenu = (object, onAdd, onEdit, onDelete) => {
        return (
            <RCMenu id={'menu_' + object.id}>
                <RCItem onClick={() => onAdd()}>
                    <Icon icon="plus" text="Add" />
                </RCItem>
                <RCItem onClick={() => onEdit()}>
                    <Icon icon="edit" text="Edit" />
                </RCItem>
                <RCItem onClick={() => onDelete()}>
                    <Icon icon="trash-alt" text="Delete" />
                </RCItem>
            </RCMenu>
        );
    }

    const createEditDeleteButtons = (object, onEdit, onDelete) => {
        return (
            <React.Fragment>
                <Icon
                    icon="edit"
                    color={Constants.fadeColor}
                    className="object-actions"
                    onClick={() => onEdit()} />
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
    }

    const createObjectMenuItem = (object, filter, onAdd, onEdit, onDelete) => {
        return (
            <Menu.Item key={object.id} filter={filter}>
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
    }

    const addObject = category => {
        props.setCategoryManagerOptions({
            visible: true,
            category: category
        });
    }

    const editObject = (category, objectId) => {
        props.setCategoryManagerOptions({
            visible: true,
            category: category,
            objectId: objectId
        });
    }

    const addFilter = () => {
        props.setFilterManagerOptions({
            visible: true
        });
    }

    const editFilter = filterId => {
        props.setFilterManagerOptions({
            visible: true,
            filterId: filterId
        });
    }

    const createFilterForObject = (object, field) => {
        return {
            id: object.id,
            title: object.title,
            color: object.color,
            condition: {
                id: "1",
                field: field,
                type: "equals",
                value: object.id
            }
        }
    }

    const onSearch = value => {
        props.setSelectedFilter(getSearchFilter(value));
    }

    const searchFilter = getSearchFilter();

    return (
        <React.Fragment>
            <Menu
                selectedKeys={[props.selectedFilter.id]}
                openKeys={openKeys}
                onSelect={onSelect}
                onOpenChange={onOpenChange}
                mode="inline">
                <Menu.Item
                    key={searchFilter.id}
                    filter={searchFilter}>
                    <Icon
                        icon={searchFilter.icon}
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
                    {getGeneralFilters().map(filter => (
                        <Menu.Item
                            key={filter.id}
                            filter={filter}>
                            <Icon
                                icon={filter.icon}
                                color={filter.color}
                                text={filter.title} />
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>
                <Menu.SubMenu key="folders" title={createCategorySubMenu('Folders', 'folder', () => addObject('folders'))}>
                    {props.folders.map(folder => createObjectMenuItem(
                        folder,
                        createFilterForObject(folder, 'folder'),
                        () => addObject('folders'),
                        () => editObject('folders', folder.id),
                        () => props.deleteFolder(folder.id)))}
                </Menu.SubMenu>
                <Menu.SubMenu key="contexts" title={createCategorySubMenu('Contexts', 'thumbtack', () => addObject('contexts'))}>
                    {props.contexts.map(context => createObjectMenuItem(
                        context,
                        createFilterForObject(context, 'context'),
                        () => addObject('contexts'),
                        () => editObject('contexts', context.id),
                        () => props.deleteContext(context.id)))}
                </Menu.SubMenu>
                <Menu.SubMenu key="goals" title={createCategorySubMenu('Goals', 'bullseye', () => addObject('goals'))}>
                    {props.goals.map(goal => createObjectMenuItem(
                        goal,
                        createFilterForObject(goal, 'goal'),
                        () => addObject('goals'),
                        () => editObject('goals', goal.id),
                        () => props.deleteGoal(goal.id)))}
                </Menu.SubMenu>
                <Menu.SubMenu key="locations" title={createCategorySubMenu('Locations', 'compass', () => addObject('locations'))}>
                    {props.locations.map(location => createObjectMenuItem(
                        location,
                        createFilterForObject(location, 'location'),
                        () => addObject('locations'),
                        () => editObject('locations', location.id),
                        () => props.deleteLocation(location.id)))}
                </Menu.SubMenu>
                <Menu.SubMenu key="tags" title={createCategorySubMenu('Tags', 'tag', () => { })}>
                </Menu.SubMenu>
                <Menu.SubMenu key="filters" title={createCategorySubMenu('Filters', 'filter', () => addFilter())}>
                    {props.filters.map(filter => createObjectMenuItem(
                        filter,
                        filter,
                        () => addFilter(),
                        () => editFilter(filter.id),
                        () => props.deleteFilter(filter.id)))}
                </Menu.SubMenu>
            </Menu >
        </React.Fragment>
    );
}

Sider.propTypes = {
    selectedFilter: FilterPropType.isRequired,
    contexts: PropTypes.arrayOf(ContextPropType).isRequired,
    folders: PropTypes.arrayOf(FolderPropType).isRequired,
    goals: PropTypes.arrayOf(GoalPropType).isRequired,
    locations: PropTypes.arrayOf(LocationPropType).isRequired,
    filters: PropTypes.arrayOf(FilterPropType).isRequired,
    setSelectedFilter: PropTypes.func.isRequired,
    setCategoryManagerOptions: PropTypes.func.isRequired,
    setFilterManagerOptions: PropTypes.func.isRequired,
    deleteContext: PropTypes.func.isRequired,
    deleteFolder: PropTypes.func.isRequired,
    deleteGoal: PropTypes.func.isRequired,
    deleteLocation: PropTypes.func.isRequired,
    deleteFilter: PropTypes.func.isRequired
};

export default withApp(
    withContexts(
        withFilters(
            withFolders(
                withGoals(
                    withLocations(Sider),
                    { filterArchived: true }),
                { filterArchived: true }))));