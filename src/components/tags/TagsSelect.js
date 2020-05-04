import React, { forwardRef } from 'react';
import { Select, Tag } from 'antd';
import PropTypes from 'prop-types';
import withBusyCheck from 'containers/WithBusyCheck';
import { useTagApi } from 'hooks/UseTagApi';

const TagsSelect = forwardRef(function TagsSelect({ apis, ...props }, ref) {
    const { tagApi } = apis;

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

TagsSelect.propTypes = {
    apis: PropTypes.object.isRequired
};

export default withBusyCheck(TagsSelect, () => ({
    tagApi: useTagApi()
}));