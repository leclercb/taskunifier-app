import React from 'react';
import PropTypes from 'prop-types';
import { Button, List, Popconfirm, Tooltip } from 'antd';
import Icon from '../common/Icon';
import LeftRight from '../common/LeftRight';
import Constants from '../constants/Constants';

function FolderList(props) {
    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.folders}
                style={{ minHeight: 400, maxHeight: 400, overflowY: "auto" }}
                renderItem={item => (
                    <List.Item
                        onClick={() => props.onFolderSelection(item)}
                        className={item.id === props.selectedFolderId ? 'selected-list-item' : null}>
                        <LeftRight right={(
                            <Popconfirm
                                title={`Do you really want to delete "${item.title}" ?`}
                                onConfirm={() => props.deleteFolder(item.id)}
                                okText="Yes"
                                cancelText="No">
                                <Icon
                                    icon="trash-alt"
                                    color={Constants.fadeColor}
                                    className="object-actions" />
                            </Popconfirm>
                        )}>
                            {item.archived ? (
                                <Tooltip title={<Icon icon="archive" color={Constants.lightColor} text="Archived" />}>
                                    <span><Icon icon="archive" color={Constants.disabledColor} /></span>
                                </Tooltip>
                            ) : null}
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