import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Empty } from 'antd';
import withFolders from 'containers/WithFolders';
import FolderList from 'components/folders/FolderList';
import FolderForm from 'components/folders/FolderForm';

function FolderManager(props) {
    const selectedFolderId = props.folderId;

    const onAddFolder = folder => {
        props.addFolder(folder).then(id => props.onFolderSelection(id));
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
                    deleteFolder={props.deleteFolder}
                    onFolderSelection={onFolderSelection} />
            </Col>
            <Col span={2}>

            </Col>
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
    onFolderSelection: PropTypes.func.isRequired
};

export default withFolders(FolderManager);