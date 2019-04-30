import { connect } from 'react-redux';
import { getLinksFromIds, getLinksFromObjects } from 'utils/LinkUtils';
import { filterObjects } from 'utils/CategoryUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withLinkedContactLinks(Component, options = { propertyId: 'linkIds' }) {
    const mapStateToProps = (state, ownProps) => {
        let links = getLinksFromObjects(filterObjects(state.tasks), 'linkedContacts');

        if (options && options.propertyId in ownProps) {
            links = getLinksFromIds(links, ownProps[options.propertyId]);
        }

        return {
            links: links
        };
    };

    const mapDispatchToProps = dispatch => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withLinkedContactLinks;