import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { getLinksFromIds, getLinksFromObjects } from 'utils/LinkUtils';
import { merge } from 'utils/ObjectUtils';

function withLinkedContactLinks(Component, options) {
    options = merge({
        getId: ownProps => ownProps.linkIds
    }, options || {});

    const mapStateToProps = (state, ownProps) => {
        let links = getLinksFromObjects(filterByVisibleState(state.tasks.all), 'linkedContacts');

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

export default withLinkedContactLinks;