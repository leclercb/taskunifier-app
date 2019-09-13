import React from 'react';
import { Select, Tag } from 'antd';
import { useTagApi } from 'hooks/UseTagApi';

export const TagsSelect = React.forwardRef(function TagsSelect(props, ref) {
    const tagApi = useTagApi();

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