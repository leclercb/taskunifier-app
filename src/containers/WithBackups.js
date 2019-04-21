import React from 'react';
import { connect } from 'react-redux';
import {
    backupData,
    cleanBackups
} from '../actions/BackupActions';

function withBackups(Component) {
    function WithBackups(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => ({

    });

    const mapDispatchToProps = dispatch => ({
        backupData: () => dispatch(backupData()),
        cleanBackups: () => dispatch(cleanBackups())
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithBackups);
}

export default withBackups;