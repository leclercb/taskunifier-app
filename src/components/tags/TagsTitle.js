import React from 'react';
import { Tag } from 'antd';
import PropTypes from 'prop-types';
import withBusyCheck from 'containers/WithBusyCheck';
import { useTagApi } from 'hooks/UseTagApi';
import { getTagsFromIds } from 'utils/TagUtils';

export function TagsTitle(props) {
    const { tagApi } = props.apis;
    const tags = getTagsFromIds(tagApi.tags, props.tagIds);

    return tags ? (
        <React.Fragment>
            {tags.map(tag => (
                <Tag key={tag.id} color={tag.color}>{tag.title}</Tag>
            ))}
        </React.Fragment>
    ) : (<span>&nbsp;</span>);
}

TagsTitle.propTypes = {
    apis: PropTypes.object.isRequired,
    tagIds: PropTypes.array
};

export default withBusyCheck(TagsTitle, () => ({
    tagApi: useTagApi()
}));