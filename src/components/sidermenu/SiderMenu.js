import React, { useState } from 'react';
import { Menu } from 'antd';
import Icon from '../common/Icon';
import withContexts from '../../containers/WithContexts';
import withFilters from '../../containers/WithFilters';
import withFolders from '../../containers/WithFolders';
import withApp from '../../containers/WithApp';

function SiderMenu(props) {
    const [openKeys, setOpenKeys] = useState(['general']);

    const onSelect = event => {
        props.setSelectedFilter({
            id: event.key,
            title: event.key
        });
    };

    const onOpenChange = keys => {
        if (keys.length === 0) {
            setOpenKeys([]);
        } else {
            setOpenKeys([keys[keys.length - 1]]);
        }
    };

    return (
        <Menu
            selectedKeys={[props.selectedFilter.id]}
            openKeys={openKeys}
            onSelect={onSelect}
            onOpenChange={onOpenChange}
            mode="inline">
            <Menu.SubMenu key="general" title={<span><Icon icon="home" /><span>General</span></span>}>
                <Menu.Item key="not-completed">{<span><Icon icon="check" /><span>Not Completed</span></span>}</Menu.Item>
                <Menu.Item key="due-today">{<span><Icon icon="calendar-alt" /><span>Due Today</span></span>}</Menu.Item>
                <Menu.Item key="overdue">{<span><Icon icon="bomb" /><span>Overdue</span></span>}</Menu.Item>
                <Menu.Item key="hot-list">{<span><Icon icon="pepper-hot" /><span>Hot List</span></span>}</Menu.Item>
                <Menu.Item key="importance">{<span><Icon icon="exclamation-triangle" /><span>Importance</span></span>}</Menu.Item>
                <Menu.Item key="starred">{<span><Icon icon="star" /><span>Starred</span></span>}</Menu.Item>
                <Menu.Item key="next-action">{<span><Icon icon="chevron-circle-right" /><span>Next Action</span></span>}</Menu.Item>
                <Menu.Item key="completed">{<span><Icon icon="check-double" /><span>Completed</span></span>}</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="folders" title={<span><Icon icon="folder" /><span>Folders</span></span>}>
                {props.folders.map(folder => <Menu.Item key={folder.id}>{folder.title}</Menu.Item>)}
            </Menu.SubMenu>
            <Menu.SubMenu key="contexts" title={<span><Icon icon="thumbtack" /><span>Contexts</span></span>}>
                {props.contexts.map(context => <Menu.Item key={context.id}>{context.title}</Menu.Item>)}
            </Menu.SubMenu>
            <Menu.SubMenu key="goals" title={<span><Icon icon="bullseye" /><span>Goals</span></span>}>
            </Menu.SubMenu>
            <Menu.SubMenu key="locations" title={<span><Icon icon="compass" /><span>Locations</span></span>}>
            </Menu.SubMenu>
            <Menu.SubMenu key="tags" title={<span><Icon icon="tag" /><span>Tags</span></span>}>
            </Menu.SubMenu>
            <Menu.SubMenu key="filters" title={<span><Icon icon="filter" /><span>Filters</span></span>}>
                {props.filters && props.filters.map(filter => <Menu.Item key={filter.id}>{filter.title}</Menu.Item>)}
            </Menu.SubMenu>
        </Menu>
    );
}

export default withApp(withContexts(withFilters(withFolders(SiderMenu))));