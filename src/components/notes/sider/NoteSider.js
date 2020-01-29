import React, { useState } from 'react';
import { Alert, Badge, Input, Menu, Switch, Tooltip } from 'antd';
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
import { equals } from 'utils/ObjectUtils';

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
        if (!settingsApi.settings.showAllBadgeCounts && filterId !== noteApi.selectedNoteFilter.id) {
            return null;
        }

        let count = 0;

        if (filterId === noteApi.selectedNoteFilter.id) {
            count = noteApi.filteredNotes.length;
        } else {
            if (!(filterId in noteFilterApi.noteFilterCounts)) {
                return null;
            }

            count = noteFilterApi.noteFilterCounts[filterId] || 0;
        }

        return (
            <Badge
                count={count}
                showZero={true}
                overflowCount={9999}
                style={{
                    backgroundColor: filterId === noteApi.selectedNoteFilter.id ? Constants.badgeColor : Constants.inactiveBadgeColor,
                    fontWeight: 'bold',
                    marginRight: 5,
                    marginBottom: 2
                }} />
        );
    };

    const containsFilterDefinition = filterDefinition => {
        const definitions = settingsApi.settings.combinedNoteFilterDefinitions || [];
        return !!definitions.find(definition => equals(definition, filterDefinition));
    };

    const updateCombinedFilterDefinitions = filterDefinition => {
        let definitions = [...(settingsApi.settings.combinedNoteFilterDefinitions || [])];
        const index = definitions.findIndex(definition => equals(definition, filterDefinition));

        if (index >= 0) {
            definitions.splice(index, 1);
        } else {
            definitions.push(filterDefinition);
        }

        settingsApi.updateSettings({
            combinedNoteFilterDefinitions: definitions
        });
    };

    const combinedFilterDefinitionNumber = (settingsApi.settings.combinedNoteFilterDefinitions || []).length;

    return (
        <React.Fragment>
            <ModalNoteFilterInfo
                noteFilter={selectedNoteFilterInfo}
                visible={!!selectedNoteFilterInfo}
                onClose={() => setSelectedNoteFilterInfo(null)} />
            <div
                className="joyride-note-sider"
                style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', minHeight: '100%' }}>
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
                    mode="inline"
                    style={{ flex: 1 }}>
                    <Menu.SubMenu
                        key="general"
                        title={<Icon icon="home" text="General" />}
                        onTitleClick={({ key }) => onOpenChange(key)}>
                        {getGeneralNoteFilters().filter(filter => settingsApi.settings['noteFilterVisible_' + filter.id] !== false).map(filter => {
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
                                                onClick={() => setSelectedNoteFilterInfo(filter)} />
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
                        {noteFilterApi.noteFilters.filter(filter => filter.directory === 'general').map(filter => {
                            const filterDefinition = { id: filter.id, type: 'default' };

                            return (
                                <Menu.Item key={filter.id} filterdef={filterDefinition}>
                                    <ObjectMenuItem
                                        badge={createBadge(filter.id)}
                                        object={filter}
                                        isCombinedFilter={containsFilterDefinition(filterDefinition)}
                                        onCombineFilter={() => updateCombinedFilterDefinitions(filterDefinition)}
                                        onManage={() => manageNoteFilters()}
                                        onEdit={() => editNoteFilter(filter.id)}
                                        onDelete={() => noteFilterApi.deleteNoteFilter(filter.id)} />
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
                        key="noteFilters"
                        title={createCategorySubMenu('Note Filters', 'filter', () => manageNoteFilters(), () => onOpenChange('noteFilters'))}>
                        {noteFilterApi.noteFilters.filter(filter => filter.directory !== 'general').map(filter => {
                            const filterDefinition = { id: filter.id, type: 'default' };

                            return (
                                <Menu.Item key={filter.id} filterdef={filterDefinition}>
                                    <ObjectMenuItem
                                        badge={createBadge(filter.id)}
                                        object={filter}
                                        isCombinedFilter={containsFilterDefinition(filterDefinition)}
                                        onCombineFilter={() => updateCombinedFilterDefinitions(filterDefinition)}
                                        onManage={() => manageNoteFilters()}
                                        onEdit={() => editNoteFilter(filter.id)}
                                        onDelete={() => noteFilterApi.deleteNoteFilter(filter.id)} />
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

export default NoteSider;