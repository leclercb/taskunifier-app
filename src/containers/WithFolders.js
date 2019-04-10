import React from 'react';
import { connect } from 'react-redux';
import { addFolder, updateFolder, deleteFolder } from '../actions/FolderActions';
import { filterObjects } from '../utils/CategoryUtils';

const mapStateToProps = state => ({
    folders: filterObjects(state.folders)
});

const mapDispatchToProps = dispatch => ({
    addFolder: folder => dispatch(addFolder(folder)),
    updateFolder: folder => dispatch(updateFolder(folder)),
    deleteFolder: folderId => dispatch(deleteFolder(folderId))
});

function withFolders(Component) {
    function WithFolders(props) {
        return <Component {...props} />
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithFolders);
}

export default withFolders;