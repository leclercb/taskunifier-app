import React from 'react';
import { Tag } from 'antd';
import PropTypes from 'prop-types';
import { useLinks } from 'hooks/UseLinks';
import { getLinksFromIds } from 'utils/LinkUtils';

function LinksTitle(props) {
    const linkApi = useLinks(props.property);
    const links = getLinksFromIds(linkApi.links, props.linkIds);

    return links && links.length > 0 ? (
        <React.Fragment>
            {links.map(link => (
                <Tag key={link.id} color={link.color}>{link.title}</Tag>
            ))}
        </React.Fragment>
    ) : (<span>&nbsp;</span>);
}

LinksTitle.propTypes = {
    linkIds: PropTypes.array,
    property: PropTypes.string.isRequired
};

export function LinkedContactLinksTitle(props) {
    return (<LinksTitle {...props} property='linkedContacts' />);
}

export function LinkedFileLinksTitle(props) {
    return (<LinksTitle {...props} property='linkedFiles' />);
}

export function LinkedTaskLinksTitle(props) {
    return (<LinksTitle {...props} property='linkedTasks' />);
}