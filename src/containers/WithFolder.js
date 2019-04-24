import { connect } from 'react-redux';
import { filterObjects } from '../utils/CategoryUtils';
import withBusyCheck from '../components/common/WithBusyCheck';

function withFolder(Component, propertyId = 'folderId') {
    const mapStateToProps = (state, ownProps) => ({
        folder: filterObjects(state.folders).find(folder => folder.id === ownProps[propertyId])
    });

    const mapDispatchToProps = dispatch => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withFolder;