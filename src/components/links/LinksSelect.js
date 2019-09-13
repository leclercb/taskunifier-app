import React from 'react';
import { Select, Tag } from 'antd';
import PropTypes from 'prop-types';
import { useLinkApi } from 'hooks/UseLinkApi';

const LinksSelect = React.forwardRef(function LinksSelect(props, ref) {
    const linkApi = useLinkApi(props.property);

    return (
        <Select ref={ref} mode="tags" allowClear={true} {...props}>
            {linkApi.links.map(link => (
                <Select.Option key={link.id} value={link.id}>
                    <Tag color={link.color}>{link.title}</Tag>
                </Select.Option>
            ))}
        </Select>
    );
});

LinksSelect.displayName = 'ForwardRefLinksSelect';

LinksSelect.propTypes = {
    property: PropTypes.string.isRequired
};

export function LinkedContactLinksSelect(props) {
    return (<LinksSelect {...props} property='linkedContacts' />);
}

export function LinkedFileLinksSelect(props) {
    return (<LinksSelect {...props} property='linkedFiles' />);
}

export function LinkedTaskLinksSelect(props) {
    return (<LinksSelect {...props} property='linkedTasks' />);
}