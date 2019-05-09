import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import { LinkPropType } from 'proptypes/LinkPropTypes';
import withLinkedContactLinks from 'containers/WithLinkedContactLinks';
import withLinkedFileLinks from 'containers/WithLinkedFileLinks';
import withLinkedTaskLinks from 'containers/WithLinkedTaskLinks';

export function LinksTitle(props) {
    const links = props.links;

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
    links: PropTypes.arrayOf(LinkPropType.isRequired).isRequired
};

export const LinkedContactLinksTitle = withLinkedContactLinks(LinksTitle);
export const LinkedFileLinksTitle = withLinkedFileLinks(LinksTitle);
export const LinkedTaskLinksTitle = withLinkedTaskLinks(LinksTitle);