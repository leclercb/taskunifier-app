import React, { useEffect, useState } from 'react';
import { Col, List, Row, Spin } from 'antd';
import { Elements, StripeProvider } from 'react-stripe-elements';
import AccountCustomer from 'components/account/AccountCustomer';
import AccountSource from 'components/account/AccountSource';
import AccountSubscription from 'components/account/AccountSubscription';
import AccountSummary from 'components/account/AccountSummary';
import Icon from 'components/common/Icon';
import { getConfig } from 'config/Config';
import { useStripeApi } from 'hooks/UseStripeApi';
import { Empty } from 'antd';

function AccountManager() {
    const stripeApi = useStripeApi();

    const [busy, setBusy] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState('summary');

    useEffect(() => {
        const getCustomer = async () => {
            try {
                setBusy(true);
                const customer = await stripeApi.getCurrentCustomer();
                setCustomer(customer);
                console.debug('Customer', customer);
            } finally {
                setBusy(false);
            }
        };

        getCustomer();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    let element;

    switch (selectedCategoryId) {
        case 'summary':
            element = (<AccountSummary customer={customer} />);
            break;
        case 'customer':
            element = (
                <AccountCustomer
                    customer={customer}
                    onCustomerUpdated={customer => setCustomer(customer)} />
            );
            break;
        case 'source':
            element = (
                <StripeProvider apiKey={getConfig().stripe.publicKey}>
                    <Elements>
                        <AccountSource
                            customer={customer}
                            onCustomerUpdated={customer => setCustomer(customer)} />
                    </Elements>
                </StripeProvider>
            );
            break;
        case 'subscription':
            element = (
                <AccountSubscription
                    customer={customer}
                    onCustomerUpdated={customer => setCustomer(customer)} />
            );
            break;
        default:
            element = (<Empty />);
            break;
    }

    return (
        <Row>
            <Col span={6}>
                <List
                    size="small"
                    bordered={true}
                    dataSource={[
                        {
                            id: 'summary',
                            title: 'Summary',
                            icon: 'user'
                        },
                        {
                            id: 'customer',
                            title: 'Billing',
                            icon: 'user'
                        },
                        {
                            id: 'source',
                            title: 'Payment Method',
                            icon: 'user'
                        },
                        {
                            id: 'subscription',
                            title: 'Subscription',
                            icon: 'user'
                        }
                    ]}
                    renderItem={item => (
                        <List.Item
                            onClick={() => setSelectedCategoryId(item.id)}
                            className={item.id === selectedCategoryId ? 'selected-list-item' : null}>
                            <Icon icon={item.icon} text={item.title} />
                        </List.Item>
                    )}
                />
            </Col>
            <Col span={2} />
            <Col span={16}>
                <Spin spinning={busy}>
                    {element}
                </Spin>
            </Col>
        </Row>
    );
}

export default AccountManager; 