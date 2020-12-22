import React, { forwardRef } from 'react';
import { Select, Tag } from 'antd';
import PropTypes from 'prop-types';
import withBusyCheck from 'containers/WithBusyCheck';
import { useLinkApi } from 'hooks/UseLinkApi';

const LinksSelect = forwardRef(function LinksSelect({ apis, ...props }, ref) {
    const { linkApi } = apis;

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
    apis: PropTypes.object.isRequired,
    property: PropTypes.string.isRequired
};

const LinksSelectBC = withBusyCheck(LinksSelect, props => ({
    linkApi: useLinkApi(props.property)
}));

export function LinkedContactLinksSelect(props) {
    return (<LinksSelectBC {...props} property="linkedContacts" />);
}

export function LinkedFileLinksSelect(props) {
    return (<LinksSelectBC {...props} property="linkedFiles" />);
}

export function LinkedTaskLinksSelect(props) {
    return (<LinksSelectBC {...props} property="linkedTasks" />);
}