import React from 'react';
import { Select, Tag } from 'antd';
import { useTags } from 'hooks/UseTags';

export const TagsSelect = React.forwardRef(function TagsSelect(props, ref) {
    const tagApi = useTags();

    return (
        <Select ref={ref} mode="tags" allowClear={true} {...props}>
            {tagApi.tags.map(tag => (
                <Select.Option key={tag.id} value={tag.id}>
                    <Tag color={tag.color}>{tag.title}</Tag>
                </Select.Option>
            ))}
        </Select>
    );
});

TagsSelect.displayName = 'ForwardRefTagsSelect';

export default TagsSelect;