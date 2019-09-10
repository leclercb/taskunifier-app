import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import withFolders from 'containers/WithFolders';
import FolderList from 'components/folders/FolderList';
import FolderForm from 'components/folders/FolderForm';
import { FolderPropType } from 'proptypes/FolderPropTypes';

function FolderManager(props) {
    const selectedFolderId = props.folderId;

    const onAddFolder = async folder => {
        folder = await props.addFolder(folder);
        props.onFolderSelection(folder.id);
    };

    const onDuplicateFolder = async folder => {
        folder = await props.duplicateFolder(folder);
        props.onFolderSelection(folder.id);
    };

    const onFolderSelection = folder => {
        props.onFolderSelection(folder.id);
    };

    const selectedFolder = props.folders.find(folder => folder.id === selectedFolderId);

    return (
        <Row>
            <Col span={6}>
                <FolderList
                    folders={props.folders}
                    selectedFolderId={selectedFolderId}
                    addFolder={onAddFolder}
                    duplicateFolder={onDuplicateFolder}
                    deleteFolder={props.deleteFolder}
                    onFolderSelection={onFolderSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedFolder ? (
                    <FolderForm key={selectedFolderId} folder={selectedFolder} updateFolder={props.updateFolder} />
                ) : <Empty description="Please select a folder" />}
            </Col>
        </Row>
    );
}

FolderManager.propTypes = {
    folderId: PropTypes.string,
    folders: PropTypes.arrayOf(FolderPropType.isRequired).isRequired,
    onFolderSelection: PropTypes.func.isRequired,
    addFolder: PropTypes.func.isRequired,
    duplicateFolder: PropTypes.func.isRequired,
    updateFolder: PropTypes.func.isRequired,
    deleteFolder: PropTypes.func.isRequired
};

export default withFolders(FolderManager);