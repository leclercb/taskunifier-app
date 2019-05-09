import React from 'react';
import PropTypes from 'prop-types';
import { LinkPropType } from 'proptypes/LinkPropTypes';
import { Select, Tag } from 'antd';
import withLinkedContactLinks from 'containers/WithLinkedContactLinks';
import withLinkedFileLinks from 'containers/WithLinkedFileLinks';
import withLinkedTaskLinks from 'containers/WithLinkedTaskLinks';

export function LinksSelect(props) {
    const { links, ...restProps } = props;

    return (
        <Select mode="tags" allowClear={true} {...restProps}>
            {links.map(link => (
                <Select.Option key={link.id} value={link.id}>
                    <Tag color={link.color}>{link.title}</Tag>
                </Select.Option>
            ))}
        </Select>
    );
}

LinksSelect.propTypes = {
    links: PropTypes.arrayOf(LinkPropType.isRequired).isRequired
};

export const LinkedContactLinksSelect = withLinkedContactLinks(LinksSelect, { getId: null });
export const LinkedFileLinksSelect = withLinkedFileLinks(LinksSelect, { getId: null });
export const LinkedTaskLinksSelect = withLinkedTaskLinks(LinksSelect, { getId: null });