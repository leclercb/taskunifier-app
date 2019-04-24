import React from 'react';
import PropTypes from 'prop-types';
import { Button, List } from 'antd';
import Icon from '../common/Icon';
import LeftRight from '../common/LeftRight';
import { createAction, createActions } from 'utils/CategoryListUtils';
import Spacer from '../common/Spacer';
import Constants from '../../constants/Constants';

function FolderList(props) {
    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.folders}
                style={{ minHeight: 400, maxHeight: 400, overflowY: 'auto' }}
                renderItem={item => (
                    <List.Item
                        onClick={() => props.onFolderSelection(item)}
                        className={item.id === props.selectedFolderId ? 'selected-list-item' : null}>
                        <LeftRight right={createActions(item, () => props.addFolder(item), () => props.deleteFolder(item.id))}>
                            {item.archived ? createAction(
                                'archive',
                                `"${item.title}" is archived`,
                                null,
                                Constants.archivedColor
                            ) : null}
                            <Spacer />
                            <Icon icon="circle" color={item.color} text={item.title} />
                        </LeftRight>
                    </List.Item>
                )}
            />
            <Button onClick={() => props.addFolder()} style={{ marginTop: 5 }}>
                <Icon icon="plus" text="Add" />
            </Button>
        </React.Fragment>
    );
}

FolderList.propTypes = {
    folders: PropTypes.array.isRequired,
    selectedFolderId: PropTypes.string,
    addFolder: PropTypes.func.isRequired,
    deleteFolder: PropTypes.func.isRequired,
    onFolderSelection: PropTypes.func.isRequired
};

export default FolderList;