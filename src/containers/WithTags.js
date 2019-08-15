import { connect } from 'react-redux';
import { deleteTag, updateTag } from 'actions/TagActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { merge } from 'utils/ObjectUtils';
import { getTagsFromIds, getTagsFromObjects } from 'utils/TagUtils';
import { getNotesFilteredByVisibleState } from 'selectors/NoteSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';

function withTags(Component, options) {
    options = merge({
        includeState: true,
        includeDispatch: true,
        getId: ownProps => ownProps.tagIds
    }, options || {});

    const mapStateToProps = (state, ownProps) => {
        const settings = getSettings(state);
        let tags = getTagsFromObjects(getNotesFilteredByVisibleState(state).concat(getTasksFilteredByVisibleState(state)), settings);

        if (options.getId) {
            tags = getTagsFromIds(tags, options.getId(ownProps));
        }

        return {
            tags
        };
    };

    const mapDispatchToProps = dispatch => ({
        updateTag: tag => dispatch(updateTag(tag)),
        deleteTag: tag => dispatch(deleteTag(tag))
    });

    return connect(
        options.includeState === true ? mapStateToProps : null,
        options.includeDispatch === true ? mapDispatchToProps : null
    )(withBusyCheck(Component));
}

export default withTags;