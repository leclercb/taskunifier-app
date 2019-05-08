import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';
import { getFoldersFilteredByVisibleState } from 'selectors/FolderSelectors';

function withFolder(Component, getId = ownProps => ownProps.folderId) {
    const mapStateToProps = (state, ownProps) => ({
        folder: getFoldersFilteredByVisibleState(state).find(folder => folder.id === getId(ownProps))
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(Component));
}

export default withFolder;