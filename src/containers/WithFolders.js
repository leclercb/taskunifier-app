import { connect } from 'react-redux';
import { addFolder, deleteFolder, updateFolder } from 'actions/FolderActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { getFoldersFilteredByVisibleState, getFoldersFilteredByNonArchived } from 'selectors/FolderSelectors';
import { merge } from 'utils/ObjectUtils';

function withFolders(Component, options) {
    options = merge({
        includeState: true,
        includeDispatch: true,
        filteredByNonArchived: false
    }, options || {});
    
    const mapStateToProps = state => {
        let folders = getFoldersFilteredByVisibleState(state);

        if (options.filteredByNonArchived === true) {
            folders = getFoldersFilteredByNonArchived(state);
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
        options.includeState === true ? mapStateToProps : null,
        options.includeDispatch === true ? mapDispatchToProps : null
    )(withBusyCheck(Component));
}

export default withFolders;