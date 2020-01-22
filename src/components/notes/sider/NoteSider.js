import React, { useState } from 'react';
import { Badge, Input, Menu, Tooltip } from 'antd';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import ModalNoteFilterInfo from 'components/notefilters/ModalNoteFilterInfo';
import ObjectMenuItem from 'components/sider/ObjectMenuItem';
import Constants from 'constants/Constants';
import { getGeneralNoteFilters } from 'data/DataNoteFilters';
import { useAppApi } from 'hooks/UseAppApi';
import { useFolderApi } from 'hooks/UseFolderApi';
import { useNoteFilterApi } from 'hooks/UseNoteFilterApi';
import { useNoteApi } from 'hooks/UseNoteApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTagApi } from 'hooks/UseTagApi';

function NoteSider() {
    const appApi = useAppApi();
    const folderApi = useFolderApi();
    const noteApi = useNoteApi();
    const noteFilterApi = useNoteFilterApi();
    const settingsApi = useSettingsApi();
    const tagApi = useTagApi();

    const [searchValue, setSearchValue] = useState(noteApi.searchNoteValue);
    const [selectedNoteFilterInfo, setSelectedNoteFilterInfo] = useState(null);

    const openKeys = settingsApi.settings.noteSiderOpenKeys;

    const setOpenKeys = openKeys => {
        settingsApi.updateSettings({
            noteSiderOpenKeys: openKeys
        });
    };

    const onSelect = event => {
        noteApi.setSelectedNoteFilterDefinition(event.item.props.filterdef);
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

    const createBadge = filterId => {
        if (filterId !== noteApi.selectedNoteFilter.id) {
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
            <ModalNoteFilterInfo
                noteFilter={selectedNoteFilterInfo}
                visible={!!selectedNoteFilterInfo}
                onClose={() => setSelectedNoteFilterInfo(null)} />
            <div
                className="joyride-note-sider"
                style={{ backgroundColor: '#ffffff', height: '100%' }}>
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
                                    onSearch={value => noteApi.setSearchNoteValue(value)}
                                    onKeyDown={event => {
                                        if (event.key === 'Escape') {
                                            setSearchValue('');
                                            noteApi.setSearchNoteValue('');
                                        }
                                    }} />
                            </Tooltip>
                        )} />
                </div>
                <Menu
                    selectedKeys={[noteApi.selectedNoteFilter.id]}
                    openKeys={openKeys}
                    onSelect={onSelect}
                    mode="inline">
                    <Menu.SubMenu
                        key="general"
                        title={<Icon icon="home" text="General" />}
                        onTitleClick={({ key }) => onOpenChange(key)}>
                        {getGeneralNoteFilters().filter(filter => settingsApi.settings['noteFilterVisible_' + filter.id] !== false).map(filter => (
                            <Menu.Item
                                key={filter.id}
                                filterdef={{ id: filter.id, type: 'general' }}>
                                <LeftRight right={(
                                    <React.Fragment>
                                        <Icon
                                            icon="info-circle"
                                            color={Constants.fadeIconColor}
                                            className="object-actions"
                                            onClick={() => setSelectedNoteFilterInfo(filter)} />
                                        {createBadge(filter)}
                                    </React.Fragment>
                                )}>
                                    <Icon
                                        icon={filter.icon}
                                        color={filter.color}
                                        text={filter.title} />
                                </LeftRight>
                            </Menu.Item>
                        ))}
                        {noteFilterApi.noteFilters.filter(filter => filter.directory === 'general').map(filter => (
                            <Menu.Item key={filter.id} filterdef={{ id: filter.id, type: 'default' }}>
                                <ObjectMenuItem
                                    badge={createBadge(filter)}
                                    object={filter}
                                    onManage={() => manageNoteFilters()}
                                    onEdit={() => editNoteFilter(filter.id)}
                                    onDelete={() => noteFilterApi.deleteNoteFilter(filter.id)} />
                            </Menu.Item>
                        ))}
                    </Menu.SubMenu>
                    <Menu.SubMenu
                        key="folders"
                        title={createCategorySubMenu('Folders', 'folder', () => manageObjects('folders'), () => onOpenChange('folders'))}>
                        {folderApi.folders.map(folder => (
                            <Menu.Item key={folder.id} filterdef={{ id: folder.id, type: 'folder' }}>
                                <ObjectMenuItem
                                    badge={createBadge(folder.id)}
                                    object={folder}
                                    onManage={() => manageObjects('folders')}
                                    onEdit={() => editObject('folders', folder.id)}
                                    onDelete={() => folderApi.deleteFolder(folder.id)}
                                    dropType="note"
                                    onDrop={(note, folder) => dropObject(note, folder, 'folder')} />
                            </Menu.Item>
                        ))}
                    </Menu.SubMenu>
                    <Menu.SubMenu
                        key="tags"
                        title={createCategorySubMenu('Tags', 'tag', () => manageObjects('tags'), () => onOpenChange('tags'))}>
                        {tagApi.tags.map(tag => (
                            <Menu.Item key={tag.id} filterdef={{ id: tag.id, type: 'tags' }}>
                                <ObjectMenuItem
                                    badge={createBadge(tag.id)}
                                    object={tag}
                                    onManage={() => manageObjects('tags')}
                                    onEdit={() => editObject('tags', tag.id)}
                                    onDelete={() => tagApi.deleteTag(tag.id)} />
                            </Menu.Item>
                        ))}
                    </Menu.SubMenu>
                    <Menu.SubMenu
                        key="noteFilters"
                        title={createCategorySubMenu('Note Filters', 'filter', () => manageNoteFilters(), () => onOpenChange('noteFilters'))}>
                        {noteFilterApi.noteFilters.filter(filter => filter.directory !== 'general').map(filter => (
                            <Menu.Item key={filter.id} filterdef={{ id: filter.id, type: 'default' }}>
                                <ObjectMenuItem
                                    badge={createBadge(filter)}
                                    object={filter}
                                    onManage={() => manageNoteFilters()}
                                    onEdit={() => editNoteFilter(filter.id)}
                                    onDelete={() => noteFilterApi.deleteNoteFilter(filter.id)} />
                            </Menu.Item>
                        ))}
                    </Menu.SubMenu>
                </Menu >
            </div>
        </React.Fragment>
    );
}

export default NoteSider;