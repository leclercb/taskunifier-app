import React from 'react';
import { Descriptions } from 'antd';
import PropTypes from 'prop-types';
import { useSessionApi } from 'hooks/UseSessionApi';

function AccountSummary({ customer }) {
    const sessionApi = useSessionApi();

    return (
        <React.Fragment>
            {!!sessionApi.session.user && (
                <Descriptions title="User Info" column={1} size="small" bordered style={{ marginBottom: 30 }}>
                    <Descriptions.Item label="Email">{sessionApi.session.user.email}</Descriptions.Item>
                </Descriptions>
            )}
            {!!customer && (
                <Descriptions title="Billing" column={1} size="small" bordered>
                    <Descriptions.Item label="Customer ID">{customer.id}</Descriptions.Item>
                    <Descriptions.Item label="Customer Balance">{(customer.balance / 100).toFixed(2)} {customer.currency}</Descriptions.Item>
                    <Descriptions.Item label="Name">{customer.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{customer.email}</Descriptions.Item>
                    {!!customer.address && (
                        <Descriptions.Item label="Address">
                            {customer.address.line1}<br />
                            {customer.address.line2}<br />
                            {customer.address.city}<br />
                            {customer.address.postal_code}<br />
                            {customer.address.state}<br />
                            {customer.address.country}
                        </Descriptions.Item>
                    )}
                </Descriptions>
            )}
        </React.Fragment>
    );
}

AccountSummary.propTypes = {
    customer: PropTypes.object
};

export default AccountSummary; 