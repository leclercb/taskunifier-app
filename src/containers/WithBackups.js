import { connect } from 'react-redux';
import {
    backupData,
    cleanBackups
} from 'actions/BackupActions';
import withBusyCheck from 'containers/WithBusyCheck';

function withBackups(Component) {
    const mapStateToProps = () => ({
        
    });

    const mapDispatchToProps = dispatch => ({
        backupData: () => dispatch(backupData()),
        cleanBackups: () => dispatch(cleanBackups())
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withBackups;