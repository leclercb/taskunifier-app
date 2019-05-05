import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';

function withFolder(Component, propertyId = 'folderId') {
    const mapStateToProps = (state, ownProps) => ({
        folder: state.folders.filteredByVisibleState.find(folder => folder.id === ownProps[propertyId])
    });

    const mapDispatchToProps = () => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withFolder;