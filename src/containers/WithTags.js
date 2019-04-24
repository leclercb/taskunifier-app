import { connect } from 'react-redux';
import { updateTag, deleteTag } from 'actions/TagActions';
import { getTagsFromIds, getTagsFromObjects } from 'utils/TagUtils';
import { filterObjects } from 'utils/CategoryUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withTags(Component, options = { propertyId: 'tagIds', actionsOnly: false }) {
    const mapStateToProps = (state, ownProps) => {
        if (options && options.actionsOnly === true) {
            return {};
        }

        let tags = getTagsFromObjects(filterObjects(state.tasks).concat(filterObjects(state.notes)));

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
    )(withBusyCheck(Component));
}

export default withTags;