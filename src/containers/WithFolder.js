import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';

function withFolder(Component, getId = ownProps => ownProps.folderId) {
    const mapStateToProps = (state, ownProps) => ({
        folder: state.folders.filteredByVisibleState.find(folder => folder.id === getId(ownProps))
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(Component));
}

export default withFolder;