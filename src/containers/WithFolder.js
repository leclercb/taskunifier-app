import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filterObjects } from '../utils/CategoryUtils';

function withFolder(Component, propertyId = 'folderId') {
    function WithFolder(props) {
        return <Component {...props} />
    }

    WithFolder.propTypes = {
        [propertyId]: PropTypes.string.isRequired
    }

    const mapStateToProps = (state, ownProps) => ({
        folder: filterObjects(state.folders).find(folder => folder.id === ownProps[propertyId])
    });

    const mapDispatchToProps = dispatch => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithFolder);
}

export default withFolder;