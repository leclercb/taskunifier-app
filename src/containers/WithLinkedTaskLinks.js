import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';
import { getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';
import { getLinksFromIds, getLinksFromObjects } from 'utils/LinkUtils';
import { merge } from 'utils/ObjectUtils';

function withLinkedTaskLinks(Component, options) {
    options = merge({
        getId: ownProps => ownProps.linkIds
    }, options || {});

    const mapStateToProps = (state, ownProps) => {
        let links = getLinksFromObjects(getTasksFilteredByVisibleState(state), 'linkedTasks');

        if (options.getId) {
            links = getLinksFromIds(links, options.getId(ownProps));
        }

        return {
            links: links
        };
    };

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(Component));
}

export default withLinkedTaskLinks;