import { connect } from 'react-redux';
import { getLinksFromIds, getLinksFromObjects } from 'utils/LinkUtils';
import { filterObjects } from 'utils/CategoryUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withLinkedFileLinks(Component, options = { propertyId: 'linkIds' }) {
    const mapStateToProps = (state, ownProps) => {
        let links = getLinksFromObjects(filterObjects(state.tasks.all), 'linkedFiles');

        if (options && options.propertyId in ownProps) {
            links = getLinksFromIds(links, ownProps[options.propertyId]);
        }

        return {
            links: links
        };
    };

    const mapDispatchToProps = () => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withLinkedFileLinks;