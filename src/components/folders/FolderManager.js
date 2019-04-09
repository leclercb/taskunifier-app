import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Empty } from 'antd';
import withFolders from '../../containers/WithFolders';
import FolderList from './FolderList';
import FolderForm from './FolderForm';

function FolderManager(props) {
    const selectedFolderId = props.folderId;

    const onFolderSelection = folder => {
        props.onFolderSelection(folder.id);
    }

    const selectedFolder = props.folders.find(folder => folder.id === selectedFolderId);

    return (
        <Row>
            <Col span={6}>
                <FolderList
                    folders={props.folders}
                    selectedFolderId={selectedFolderId}
                    addFolder={props.addFolder}
                    deleteFolder={props.deleteFolder}
                    onFolderSelection={onFolderSelection} />
            </Col>
            <Col span={2}>

            </Col>
            <Col span={16}>
                {selectedFolder ? (
                    <FolderForm key={selectedFolderId} folder={selectedFolder} updateFolder={props.updateFolder} />
                ) : <Empty />}
            </Col>
        </Row>
    );
}

FolderManager.propTypes = {
    folderId: PropTypes.string,
    onFolderSelection: PropTypes.func.isRequired
}

export default withFolders(FolderManager);