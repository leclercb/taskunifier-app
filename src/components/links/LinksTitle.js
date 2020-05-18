import React from 'react';
import { Tag } from 'antd';
import PropTypes from 'prop-types';
import withBusyCheck from 'containers/WithBusyCheck';
import { useLinkApi } from 'hooks/UseLinkApi';
import { getLinksFromIds } from 'utils/LinkUtils';

function LinksTitle({ apis, linkIds }) {
    const { linkApi } = apis;

    const links = getLinksFromIds(linkApi.links, linkIds);

    return links && links.length > 0 ? (
        <React.Fragment>
            {links.map(link => (
                <Tag key={link.id} color={link.color}>{link.title}</Tag>
            ))}
        </React.Fragment>
    ) : (<span>&nbsp;</span>);
}

LinksTitle.propTypes = {
    apis: PropTypes.object.isRequired,
    linkIds: PropTypes.array,
    property: PropTypes.string.isRequired
};

const LinksTitleBC = withBusyCheck(LinksTitle, props => ({
    linkApi: useLinkApi(props.property)
}));

export function LinkedContactLinksTitle(props) {
    return (<LinksTitleBC {...props} property='linkedContacts' />);
}

export function LinkedFileLinksTitle(props) {
    return (<LinksTitleBC {...props} property='linkedFiles' />);
}

export function LinkedTaskLinksTitle(props) {
    return (<LinksTitleBC {...props} property='linkedTasks' />);
}