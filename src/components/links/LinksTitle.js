import React from 'react';
import { Tag } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';
import { getLinksFromIds, getLinksFromObjects } from 'utils/LinkUtils';

function LinksTitle(props) {
    const tasks = useSelector(getTasksFilteredByVisibleState);
    let links = getLinksFromObjects(tasks, props.property);
    links = getLinksFromIds(links, props.linkIds);

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