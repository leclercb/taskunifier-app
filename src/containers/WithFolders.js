import { connect } from 'react-redux';
import { addFolder, updateFolder, deleteFolder } from '../actions/FolderActions';
import { filterObjects, filterArchivedObjects } from '../utils/CategoryUtils';
import withBusyCheck from '../components/common/WithBusyCheck';

function withFolders(Component, options = { actionsOnly: false, filterArchived: false }) {
    const mapStateToProps = state => {
        if (options && options.actionsOnly === true) {
            return {
                busy: state.processes.busy
            };
        }

        let folders = filterObjects(state.folders);

        if (options && options.filterArchived === true) {
            folders = filterArchivedObjects(folders);
        }

        return {
            busy: state.processes.busy,
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