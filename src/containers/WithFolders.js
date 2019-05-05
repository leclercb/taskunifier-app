import { connect } from 'react-redux';
import { addFolder, deleteFolder, updateFolder } from 'actions/FolderActions';
import withBusyCheck from 'containers/WithBusyCheck';

function withFolders(Component, options = { actionsOnly: false, filterArchived: false }) {
    const mapStateToProps = state => {
        if (options && options.actionsOnly === true) {
            return {};
        }

        let folders = state.folders.filteredByVisibleState;

        if (options && options.filterArchived === true) {
            folders = state.folders.filteredByNonArchived;
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
    )(withBusyCheck(Component));
}

export default withFolders;