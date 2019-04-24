import { connect } from 'react-redux';
import { filterObjects } from 'utils/CategoryUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withFolder(Component, propertyId = 'folderId') {
    const mapStateToProps = (state, ownProps) => ({
        folder: filterObjects(state.folders).find(folder => folder.id === ownProps[propertyId])
    });

    const mapDispatchToProps = () => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withFolder;