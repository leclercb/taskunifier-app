import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Menu, Popconfirm } from 'antd';
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

function Sider(props) {
    const [openKeys, setOpenKeys] = useState(['general']);

    const onSelect = event => {
        props.setSelectedFilter({
            id: event.key,
            title: event.key
        });
    };

    const onOpenChange = keys => {
        setOpenKeys(keys);
    };

    const createCategorySubMenu = (text, icon, onAdd) => {
        return (
            <LeftRight right={<Icon
                icon="plus"
                color="#eaeff7"
                className="object-actions"
                onClick={() => onAdd()} />}>
                <Icon icon={icon} text={text} />
            </LeftRight>
        );
    }

    const createEditDeleteButtons = (object, onEdit, onDelete) => {
        return (
            <React.Fragment>
                <Icon
                    icon="edit"
                    color="#e3f2eb"
                    className="object-actions"
                    onClick={() => onEdit()} />
                <Popconfirm
                    title={`Do you really want to delete "${object.title}" ?`}
                    onConfirm={() => onDelete()}
                    okText="Yes"
                    cancelText="No">
                    <Icon
                        icon="trash-alt"
                        color="#e3f2eb"
                        className="object-actions" />
                </Popconfirm>
            </React.Fragment>
        );
    }

    const createObjectMenuItem = (object, onEdit, onDelete) => {
        return (
            <Menu.Item key={object.id}>
                <LeftRight right={createEditDeleteButtons(object, onEdit, onDelete)}>
                    <Icon icon="circle" color={object.color} text={object.title} />
                </LeftRight>
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

    return (
        <Menu
            selectedKeys={[props.selectedFilter.id]}
            openKeys={openKeys}
            onSelect={onSelect}
            onOpenChange={onOpenChange}
            mode="inline">
            <Menu.SubMenu key="general" title={<Icon icon="home" text="General" />}>
                <Menu.Item key="not-completed">{<Icon icon="check" text="Not Completed" />}</Menu.Item>
                <Menu.Item key="due-today">{<Icon icon="calendar-alt" text="Due Today" />}</Menu.Item>
                <Menu.Item key="overdue">{<Icon icon="bomb" text="Overdue" />}</Menu.Item>
                <Menu.Item key="hot-list">{<Icon icon="pepper-hot" text="Hot List" />}</Menu.Item>
                <Menu.Item key="importance">{<Icon icon="exclamation-triangle" text="Importance" />}</Menu.Item>
                <Menu.Item key="starred">{<Icon icon="star" text="Starred" />}</Menu.Item>
                <Menu.Item key="next-action">{<Icon icon="chevron-circle-right" text="Next Action" />}</Menu.Item>
                <Menu.Item key="completed">{<Icon icon="check-double" text="Completed" />}</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="folders" title={createCategorySubMenu('Folders', 'folder', () => addObject('folders'))}>
                {props.folders.map(folder => createObjectMenuItem(folder, () => editObject('folders', folder.id), () => props.deleteFolder(folder.id)))}
            </Menu.SubMenu>
            <Menu.SubMenu key="contexts" title={createCategorySubMenu('Contexts', 'thumbtack', () => addObject('contexts'))}>
                {props.contexts.map(context => createObjectMenuItem(context, () => editObject('contexts', context.id), () => props.deleteContext(context.id)))}
            </Menu.SubMenu>
            <Menu.SubMenu key="goals" title={createCategorySubMenu('Goals', 'bullseye', () => addObject('goals'))}>
                {props.goals.map(goal => createObjectMenuItem(goal, () => editObject('goals', goal.id), () => props.deleteGoal(goal.id)))}
            </Menu.SubMenu>
            <Menu.SubMenu key="locations" title={createCategorySubMenu('Locations', 'compass', () => addObject('locations'))}>
                {props.locations.map(location => createObjectMenuItem(location, () => editObject('locations', location.id), () => props.deleteLocation(location.id)))}
            </Menu.SubMenu>
            <Menu.SubMenu key="tags" title={createCategorySubMenu('Tags', 'tag', () => { })}>
            </Menu.SubMenu>
            <Menu.SubMenu key="filters" title={createCategorySubMenu('Filters', 'filter', () => addFilter())}>
                {props.filters.map(filter => createObjectMenuItem(filter, () => editFilter(filter.id), () => props.deleteFilter(filter.id)))}
            </Menu.SubMenu>
        </Menu >
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
}

export default withApp(withContexts(withFilters(withFolders(withGoals(withLocations(Sider))))));