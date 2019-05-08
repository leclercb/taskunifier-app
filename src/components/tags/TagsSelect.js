import React from 'react';
import PropTypes from 'prop-types';
import { TagPropType } from 'proptypes/TagPropTypes';
import { Select, Tag } from 'antd';
import withTags from 'containers/WithTags';

function TagsSelect(props, ref) {
    const { tags, ...restProps } = props;

    return (
        <Select ref={ref} mode="tags" allowClear={true} {...restProps}>
            {tags.map(tag => (
                <Select.Option key={tag.id} value={tag.id}>
                    <Tag color={tag.color}>{tag.title}</Tag>
                </Select.Option>
            ))}
        </Select>
    );
};

TagsSelect.propTypes = {
    tags: PropTypes.arrayOf(TagPropType.isRequired).isRequired
};

const FRTagsSelect = React.forwardRef(TagsSelect);

export { FRTagsSelect as TagsSelect };
export default withTags(FRTagsSelect, { getId: null });