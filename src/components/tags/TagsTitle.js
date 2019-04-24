import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import { TagPropType } from '../../proptypes/TagPropTypes';
import withTags from '../../containers/WithTags';

export function TagsTitle(props) {
    const tags = props.tags;
    return tags ? (
        <React.Fragment>
            {tags.map(tag => (
                <Tag key={tag.id} color={tag.color}>{tag.title}</Tag>
            ))}
        </React.Fragment>
    ) : (<span>&nbsp;</span>);
}

TagsTitle.propTypes = {
    tagIds: PropTypes.array,
    tags: PropTypes.arrayOf(TagPropType).isRequired
};

export default withTags(TagsTitle);