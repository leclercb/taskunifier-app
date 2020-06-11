import React, { useEffect, useState } from 'react';
import { Button, Descriptions, Modal, Spin } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import { injectStripe } from 'react-stripe-elements';
import { useStripeApi } from 'hooks/UseStripeApi';
import Plans from 'components/account/Plans';
import LeftRight from 'components/common/LeftRight';
import { useSessionApi } from 'hooks/UseSessionApi';
import logger from 'utils/LogUtils';

function AccountSubscription({ customer, onCustomerUpdated, stripe }) {
    const sessionApi = useSessionApi();
    const stripeApi = useStripeApi();

    const [busy, setBusy] = useState(false);
    const [scaRequired, setSCARequired] = useState(false);

    const source = customer && customer.sources.data.length > 0 ? customer.sources.data[0] : null;
    const subscription = customer && customer.subscriptions.data.length > 0 ? customer.subscriptions.data[0] : null;

    useEffect(() => {
        const checkSCA = async subscription => {
            if (!subscription || subscription.status !== 'incomplete') {
                setSCARequired(false);
                return;
            }

            const invoice = await stripeApi.getCurrentSubscriptionLatestInvoice();
            logger.debug('Invoice', invoice);

            setSCARequired(invoice.payment_intent.status === 'requires_action');
        };

        checkSCA(subscription);
    }, [subscription]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSCA = async subscription => {
        try {
            setBusy(true);

            if (subscription && subscription.status === 'incomplete') {
                const invoice = await stripeApi.getCurrentSubscriptionLatestInvoice();
                logger.debug('Invoice', invoice);

                if (invoice.payment_intent.status === 'requires_action') {
                    const cardPaymentResult = await stripe.handleCardPayment(invoice.payment_intent.client_secret);
                    logger.debug('Handle card payment', cardPaymentResult);
                }
            }

            const customer = await stripeApi.getCurrentCustomer();
            onCustomerUpdated(customer);
            await sessionApi.refreshCurrentUser();
        } finally {
            setBusy(false);
        }
    };

    const selectPlan = async plan => {
        if (!source) {
            Modal.error({
                title: 'Error',
                content: 'Please fill in your billing details and your payment method first.'
            });

            return;
        }

        try {
            setBusy(true);

            let proration = {
                cost: plan.amount
            };

            if (subscription) {
                proration = await stripeApi.getCurrentSubscriptionPlanProration(plan.id, 1);
            }

            logger.debug('Proration', proration);

            Modal.confirm({
                title: 'Confirmation',
                content: (
                    <React.Fragment>
                        <span>{`You selected the plan "${plan.nickname}".`}</span>
                        <br />
                        <span>{`The subscription amount is ${(plan.amount / 100).toFixed(2)} ${plan.currency} per ${plan.interval}.`}</span>
                        <br />
                        <span>{`By confirming, the following amount will immediately be charged: ${(proration.cost / 100).toFixed(2)} ${plan.currency}.`}</span>
                    </React.Fragment>
                ),
                onOk: async () => {
                    try {
                        setBusy(true);
                        const subscription = await stripeApi.setCurrentSubscriptionPlan(plan.id, 1);
                        await handleSCA(subscription);

                        Modal.success({
                            title: 'Subscription',
                            content: 'The subscription has been successfully activated.'
                        });
                    } finally {
                        setBusy(false);
                    }
                }
            });
        } finally {
            setBusy(false);
        }
    };

    const updateSubscription = async cancelAtPeriodEnd => {
        try {
            setBusy(true);

            await stripeApi.updateCurrentSubscription({
                cancelAtPeriodEnd
            });

            const customer = await stripeApi.getCurrentCustomer();
            onCustomerUpdated(customer);
            await sessionApi.refreshCurrentUser();
        } finally {
            setBusy(false);
        }
    };

    return (
        <Spin spinning={busy}>
            <Descriptions title="Current Subscription" column={1} size="small" bordered style={{ marginBottom: 30 }}>
                <Descriptions.Item label="Plan">
                    <LeftRight right={(
                        <React.Fragment>
                            {subscription && !subscription.cancel_at_period_end && (
                                <Button onClick={() => updateSubscription(true)} danger={true} size="small">Cancel subscription at period end</Button>
                            )}
                            {subscription && subscription.cancel_at_period_end && (
                                <Button onClick={() => updateSubscription(false)} danger={true} size="small">Resume subscription</Button>
                            )}
                        </React.Fragment>
                    )}>
                        {subscription ? subscription.plan.nickname : 'None'}
                    </LeftRight>
                </Descriptions.Item>
                <Descriptions.Item label="Subscription Status">
                    <LeftRight right={(
                        <React.Fragment>
                            {subscription && scaRequired && (
                                <Button onClick={() => handleSCA(handleSCA)} danger={true} size="small">Retry customer strong authentication</Button>
                            )}
                        </React.Fragment>
                    )}>
                        {subscription ? subscription.status : ''}
                    </LeftRight>
                </Descriptions.Item>
                <Descriptions.Item label="Subscription End Date">
                    {subscription && subscription.cancel_at ? moment(subscription.cancel_at * 1000).toISOString() : 'Never'}
                </Descriptions.Item>
                <Descriptions.Item label="Current Period Start">
                    {subscription ? moment(subscription.current_period_start * 1000).toISOString() : ''}
                </Descriptions.Item>
                <Descriptions.Item label="Current Period End">
                    {subscription ? moment(subscription.current_period_end * 1000).toISOString() : ''}
                </Descriptions.Item>
            </Descriptions>
            <Descriptions title="Change Plan" column={1} size="small" />
            <Plans onSelectPlan={selectPlan} />
        </Spin>
    );
}

AccountSubscription.propTypes = {
    customer: PropTypes.object,
    onCustomerUpdated: PropTypes.func,
    stripe: PropTypes.object.isRequired
};

export default injectStripe(AccountSubscription); 