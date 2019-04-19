import React from 'react';
import { connect } from 'react-redux';
import { updateTag, deleteTag } from '../actions/TaskActions';
import { getTagsFromIds, getTagsFromTasks } from '../utils/TagUtils';

function withTags(Component, options = { propertyId: 'tagIds', actionsOnly: false }) {
    function WithTags(props) {
        return <Component {...props} />
    }

    const mapStateToProps = (state, ownProps) => {
        if (options && options.actionsOnly === true) {
            return {};
        }

        let tags = getTagsFromTasks(state.tasks);

        if (options && options.propertyId in ownProps) {
            tags = getTagsFromIds(tags, ownProps[options.propertyId]);
        }

        return {
            tags: tags
        };
    };

    const mapDispatchToProps = dispatch => ({
        updateTag: tag => dispatch(updateTag(tag)),
        deleteTag: tag => dispatch(deleteTag(tag))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithTags);
}

export default withTags;