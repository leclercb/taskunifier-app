import React, { useState } from 'react';
import { Badge, Input, Menu, Tooltip } from 'antd';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import ObjectMenuItem from 'components/sider/ObjectMenuItem';
import Constants from 'constants/Constants';
import { createSearchNoteFilter, getGeneralNoteFilters } from 'data/DataNoteFilters';
import { useAppApi } from 'hooks/UseAppApi';
import { useFolderApi } from 'hooks/UseFolderApi';
import { useNoteFilterApi } from 'hooks/UseNoteFilterApi';
import { useNoteApi } from 'hooks/UseNoteApi';
import { useTagApi } from 'hooks/UseTagApi';

function NoteSider() {
    const appApi = useAppApi();
    const folderApi = useFolderApi();
    const noteApi = useNoteApi();
    const noteFilterApi = useNoteFilterApi();
    const tagApi = useTagApi();

    const [openKeys, setOpenKeys] = useState(['general']);

    const onSelect = event => {
        noteApi.setSelectedNoteFilter(event.item.props.filter);
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

    const dropObject = (note, object, property) => {
        noteApi.updateNote({
            ...note,
            [property]: object.id
        });
    };

    const manageNoteFilters = () => {
        appApi.setNoteFilterManagerOptions({
            visible: true
        });
    };

    const editNoteFilter = noteFilterId => {
        appApi.setNoteFilterManagerOptions({
            visible: true,
            noteFilterId
        });
    };

    const createNoteFilterForObject = (object, field, condition = {
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
        noteApi.setSelectedNoteFilter(createSearchNoteFilter(value));
    };

    const searchNoteFilter = createSearchNoteFilter();

    const createBadge = noteFilter => {
        if (noteFilter.id !== noteApi.selectedNoteFilter.id) {
            return null;
        }

        return (
            <Badge
                count={noteApi.filteredNotes.length}
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
        <React.Fragment>
            <Menu
                selectedKeys={[noteApi.selectedNoteFilter.id]}
                openKeys={openKeys}
                onSelect={onSelect}
                mode="inline"
                style={{ height: '100%' }}>
                <Menu.Item
                    key={searchNoteFilter.id}
                    filter={searchNoteFilter}>
                    <Icon
                        icon={searchNoteFilter.icon}
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
                    {getGeneralNoteFilters().map(noteFilter => (
                        <Menu.Item
                            key={noteFilter.id}
                            filter={noteFilter}>
                            <LeftRight right={createBadge(noteFilter)}>
                                <Icon
                                    icon={noteFilter.icon}
                                    color={noteFilter.color}
                                    text={noteFilter.title} />
                            </LeftRight>
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>
                <Menu.SubMenu
                    key="folders"
                    title={createCategorySubMenu('Folders', 'folder', () => manageObjects('folders'), () => onOpenChange('folders'))}>
                    {folderApi.folders.map(folder => {
                        const filter = createNoteFilterForObject(folder, 'folder');

                        return (
                            <Menu.Item key={folder.id} filter={filter}>
                                <ObjectMenuItem
                                    badge={createBadge(filter)}
                                    object={folder}
                                    onManage={() => manageObjects('folders')}
                                    onEdit={() => editObject('folders', folder.id)}
                                    onDelete={() => folderApi.deleteFolder(folder.id)}
                                    dropType="note"
                                    onDrop={(note, folder) => dropObject(note, folder, 'folder')} />
                            </Menu.Item>
                        );
                    })}
                </Menu.SubMenu>
                <Menu.SubMenu
                    key="tags"
                    title={createCategorySubMenu('Tags', 'tag', () => manageObjects('tags'), () => onOpenChange('tags'))}>
                    {tagApi.tags.map(tag => {
                        const filter = createNoteFilterForObject(tag, 'tags', {
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
                    key="noteFilters"
                    title={createCategorySubMenu('Note Filters', 'filter', () => manageNoteFilters(), () => onOpenChange('noteFilters'))}>
                    {noteFilterApi.noteFilters.map(noteFilter => (
                        <Menu.Item key={noteFilter.id} filter={noteFilter}>
                            <ObjectMenuItem
                                badge={createBadge(noteFilter)}
                                object={noteFilter}
                                onManage={() => manageNoteFilters()}
                                onEdit={() => editNoteFilter(noteFilter.id)}
                                onDelete={() => noteFilterApi.deleteNoteFilter(noteFilter.id)} />
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>
            </Menu >
        </React.Fragment>
    );
}

export default NoteSider;