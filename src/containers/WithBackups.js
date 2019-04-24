import { connect } from 'react-redux';
import {
    backupData,
    cleanBackups
} from '../actions/BackupActions';
import withBusyCheck from '../components/common/WithBusyCheck';

function withBackups(Component) {
    const mapStateToProps = state => ({
        
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