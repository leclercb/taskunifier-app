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
        setOpenKeys(keys);
    };

    return (
        <Menu
            selectedKeys={[props.selectedFilter.id]}
            openKeys={openKeys}
            onSelect={onSelect}
            onOpenChange={onOpenChange}
            mode="inline">
            <Menu.SubMenu key="general" title={<Icon icon="home" text="General"/>}>
                <Menu.Item key="not-completed">{<Icon icon="check" text="Not Completed"/>}</Menu.Item>
                <Menu.Item key="due-today">{<Icon icon="calendar-alt" text="Due Today"/>}</Menu.Item>
                <Menu.Item key="overdue">{<Icon icon="bomb" text="Overdue"/>}</Menu.Item>
                <Menu.Item key="hot-list">{<Icon icon="pepper-hot" text="Hot List"/>}</Menu.Item>
                <Menu.Item key="importance">{<Icon icon="exclamation-triangle" text="Importance"/>}</Menu.Item>
                <Menu.Item key="starred">{<Icon icon="star" text="Starred"/>}</Menu.Item>
                <Menu.Item key="next-action">{<Icon icon="chevron-circle-right" text="Next Action"/>}</Menu.Item>
                <Menu.Item key="completed">{<Icon icon="check-double" text="Completed"/>}</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="folders" title={<Icon icon="folder" text="Folders"/>}>
                {props.folders.map(folder => <Menu.Item key={folder.id}><Icon icon="circle" color={folder.color} text={folder.title}/></Menu.Item>)}
            </Menu.SubMenu>
            <Menu.SubMenu key="contexts" title={<Icon icon="thumbtack" text="Contexts"/>}>
                {props.contexts.map(context => <Menu.Item key={context.id}><Icon icon="circle" color={context.color} text={context.title}/></Menu.Item>)}
            </Menu.SubMenu>
            <Menu.SubMenu key="goals" title={<Icon icon="bullseye" text="Goals"/>}>
            </Menu.SubMenu>
            <Menu.SubMenu key="locations" title={<Icon icon="compass" text="Locations"/>}>
            </Menu.SubMenu>
            <Menu.SubMenu key="tags" title={<Icon icon="tag" text="Tags"/>}>
            </Menu.SubMenu>
            <Menu.SubMenu key="filters" title={<Icon icon="filter" text="Filters"/>}>
                {props.filters && props.filters.map(filter => <Menu.Item key={filter.id}>{filter.title}</Menu.Item>)}
            </Menu.SubMenu>
        </Menu>
    );
}

export default withApp(withContexts(withFilters(withFolders(SiderMenu))));