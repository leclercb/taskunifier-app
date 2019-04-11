import React from 'react';
import { connect } from 'react-redux';
import { addFolder, updateFolder, deleteFolder } from '../actions/FolderActions';
import { filterObjects, filterArchivedObjects } from '../utils/CategoryUtils';

function withFolders(Component, options = { filterArchived: false }) {
    function WithFolders(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => {
        let folders = filterObjects(state.folders);

        if (options && options.filterArchived === true) {
            folders = filterArchivedObjects(folders);
        }

        return {
            folders: folders
        };
    };
    
    const mapDispatchToProps = dispatch => ({
        addFolder: folder => dispatch(addFolder(folder)),
        updateFolder: folder => dispatch(updateFolder(folder)),
        deleteFolder: folderId => dispatch(deleteFolder(folderId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithFolders);
}

export default withFolders;