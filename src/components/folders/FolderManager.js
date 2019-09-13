import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import FolderList from 'components/folders/FolderList';
import FolderForm from 'components/folders/FolderForm';
import { useFolderApi } from 'hooks/UseFolderApi';

function FolderManager(props) {
    const folderApi = useFolderApi();
    const selectedFolderId = props.folderId;

    const onAddFolder = async folder => {
        folder = await folderApi.addFolder(folder);
        props.onFolderSelection(folder.id);
    };

    const onDuplicateFolder = async folder => {
        folder = await folderApi.duplicateFolder(folder);
        props.onFolderSelection(folder.id);
    };

    const onFolderSelection = folder => {
        props.onFolderSelection(folder.id);
    };

    const selectedFolder = folderApi.folders.find(folder => folder.id === selectedFolderId);

    return (
        <Row>
            <Col span={6}>
                <FolderList
                    folders={folderApi.folders}
                    selectedFolderId={selectedFolderId}
                    addFolder={onAddFolder}
                    duplicateFolder={onDuplicateFolder}
                    deleteFolder={folderApi.deleteFolder}
                    onFolderSelection={onFolderSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedFolder ? (
                    <FolderForm key={selectedFolderId} folder={selectedFolder} updateFolder={folderApi.updateFolder} />
                ) : <Empty description="Please select a folder" />}
            </Col>
        </Row>
    );
}

FolderManager.propTypes = {
    folderId: PropTypes.string,
    onFolderSelection: PropTypes.func.isRequired
};

export default FolderManager;