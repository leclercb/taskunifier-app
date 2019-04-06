import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    folders: state.folders
});

const mapDispatchToProps = dispatch => ({

});

function withFolders(Component) {
    function WithFolders(props) {
        return <Component {...props} />
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithFolders);
}

export default withFolders;