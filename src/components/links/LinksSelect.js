import React from 'react';
import PropTypes from 'prop-types';
import { LinkPropType } from 'proptypes/LinkPropTypes';
import { Select, Tag } from 'antd';
import withLinkedContactLinks from 'containers/WithLinkedContactLinks';
import withLinkedFileLinks from 'containers/WithLinkedFileLinks';
import withLinkedTaskLinks from 'containers/WithLinkedTaskLinks';

export const LinksSelect = React.forwardRef(function LinksSelect(props, ref) {
    const { links, ...restProps } = props;
    console.log(props);

    return (
        <Select ref={ref} mode="tags" allowClear={true} {...restProps}>
            {links.map(link => (
                <Select.Option key={link.id} value={link.id}>
                    <Tag color={link.color}>{link.title}</Tag>
                </Select.Option>
            ))}
        </Select>
    );
});

LinksSelect.propTypes = {
    links: PropTypes.arrayOf(LinkPropType).isRequired
};

export const LinkedContactLinksSelect = withLinkedContactLinks(LinksSelect);
export const LinkedFileLinksSelect = withLinkedFileLinks(LinksSelect);
export const LinkedTaskLinksSelect = withLinkedTaskLinks(LinksSelect);