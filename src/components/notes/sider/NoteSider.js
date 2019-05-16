import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Badge, Input, Menu, Popconfirm, Tooltip } from 'antd';
import { Item as RCItem, Menu as RCMenu, MenuProvider as RCMenuProvider } from 'react-contexify';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import Spacer from 'components/common/Spacer';
import withApp from 'containers/WithApp';
import withObjects from 'containers/WithObjects';
import Constants from 'constants/Constants';
import { createSearchNoteFilter, getGeneralNoteFilters } from 'data/DataNoteFilters';
import { FolderPropType } from 'proptypes/FolderPropTypes';
import { NoteFilterPropType } from 'proptypes/NoteFilterPropTypes';
import { TagPropType } from 'proptypes/TagPropTypes';

function NoteSider(props) {
    const [openKeys, setOpenKeys] = useState(['general']);

    const onSelect = event => {
        props.setSelectedNoteFilter(event.item.props.filter);
    };

    const onOpenChange = keys => {
        setOpenKeys(keys);
    };

    const createCategorySubMenu = (text, icon, onAdd) => {
        return (
            <LeftRight right={onAdd ? (
                <Icon
                    icon="plus"
                    color={Constants.fadeColor}
                    className="object-actions"
                    onClick={() => onAdd()} />
            ) : null}>
                <Icon icon={icon} text={text} />
            </LeftRight>
        );
    };

    const createObjectContextMenu = (object, onAdd, onEdit) => {
        return (
            <RCMenu id={'menu_' + object.id}>
                {onAdd ? (
                    <RCItem onClick={() => onAdd()}>
                        <Icon icon="plus" text="Add" />
                    </RCItem>
                ) : null}
                {onEdit ? (
                    <RCItem onClick={() => onEdit()}>
                        <Icon icon="edit" text="Edit" />
                    </RCItem>
                ) : null}
            </RCMenu>
        );
    };

    const createEditDeleteButtons = (object, onEdit, onDelete) => {
        return (
            <React.Fragment>
                <Icon
                    icon="edit"
                    color={Constants.fadeColor}
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
                        color={Constants.fadeColor}
                        className="object-actions" />
                </Popconfirm>
            </React.Fragment>
        );
    };

    const createObjectMenuItem = (object, noteFilter, onAdd, onEdit, onDelete) => {
        return (
            <Menu.Item key={object.id} filter={noteFilter}>
                <RCMenuProvider id={'menu_' + object.id}>
                    <div>
                        <LeftRight right={(
                            <React.Fragment>
                                {createEditDeleteButtons(object, onEdit, onDelete)}
                                {createBadge(noteFilter)}
                            </React.Fragment>
                        )}>
                            <Icon icon="circle" color={object.color} text={object.title} />
                        </LeftRight>
                    </div>
                </RCMenuProvider>
                {createObjectContextMenu(object, onAdd, onEdit)}
            </Menu.Item>
        );
    };

    const addObject = category => {
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

    const addNoteFilter = () => {
        props.setNoteFilterManagerOptions({
            visible: true
        });
    };

    const editNoteFilter = noteFilterId => {
        props.setNoteFilterManagerOptions({
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
        props.setSelectedNoteFilter(createSearchNoteFilter(value));
    };

    const searchNoteFilter = createSearchNoteFilter();

    const createBadge = noteFilter => {
        if (noteFilter.id !== props.selectedNoteFilter.id) {
            return null;
        }

        return <Badge
            count={props.noteNumber}
            showZero={true}
            overflowCount={9999}
            style={{
                backgroundColor: Constants.badgeColor,
                fontWeight: 'bold',
                marginLeft: 10,
                marginBottom: 2
            }} />;
    };

    return (
        <React.Fragment>
            <Menu
                selectedKeys={[props.selectedNoteFilter.id]}
                openKeys={openKeys}
                onSelect={onSelect}
                onOpenChange={onOpenChange}
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
                <Menu.SubMenu key="general" title={<Icon icon="home" text="General" />}>
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
                <Menu.SubMenu key="folders" title={createCategorySubMenu('Folders', 'folder', () => addObject('folders'))}>
                    {props.folders.map(folder => createObjectMenuItem(
                        folder,
                        createNoteFilterForObject(folder, 'folder'),
                        () => addObject('folders'),
                        () => editObject('folders', folder.id),
                        () => props.deleteFolder(folder.id)))}
                </Menu.SubMenu>
                <Menu.SubMenu key="tags" title={createCategorySubMenu('Tags', 'tag', null)}>
                    {props.tags.map(tag => createObjectMenuItem(
                        tag,
                        createNoteFilterForObject(tag, 'tags', {
                            id: '1',
                            field: 'tags',
                            type: 'contain',
                            value: tag.id
                        }),
                        null,
                        () => editObject('tags', tag.id),
                        () => props.deleteTag(tag.id)))}
                </Menu.SubMenu>
                <Menu.SubMenu key="noteFilters" title={createCategorySubMenu('Note Filters', 'filter', () => addNoteFilter())}>
                    {props.noteFilters.map(noteFilter => createObjectMenuItem(
                        noteFilter,
                        noteFilter,
                        () => addNoteFilter(),
                        () => editNoteFilter(noteFilter.id),
                        () => props.deleteNoteFilter(noteFilter.id)))}
                </Menu.SubMenu>
            </Menu >
        </React.Fragment>
    );
}

NoteSider.propTypes = {
    folders: PropTypes.arrayOf(FolderPropType.isRequired).isRequired,
    noteFilters: PropTypes.arrayOf(NoteFilterPropType.isRequired).isRequired,
    tags: PropTypes.arrayOf(TagPropType.isRequired).isRequired,
    noteNumber: PropTypes.number.isRequired,
    selectedNoteFilter: NoteFilterPropType.isRequired,
    setSelectedNoteFilter: PropTypes.func.isRequired,
    setCategoryManagerOptions: PropTypes.func.isRequired,
    setNoteFilterManagerOptions: PropTypes.func.isRequired,
    deleteFolder: PropTypes.func.isRequired,
    deleteNoteFilter: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired
};

export default withApp(withObjects(NoteSider, {
    includeDispatch: true,
    includeFolders: true,
    includeNoteFilters: true,
    includeTags: true,
    includeSelectedNoteFilter: true,
    includeNoteNumber: true,
    filteredByNonArchivedFolders: true
}));