import React, { useState } from 'react';
import { Button, Descriptions, Modal, Spin } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import { injectStripe } from 'react-stripe-elements';
import { useStripeApi } from 'hooks/UseStripeApi';
import Plans from 'components/account/Plans';
import LeftRight from 'components/common/LeftRight';

function AccountSubscription({ customer, onCustomerUpdated, stripe }) {
    const stripeApi = useStripeApi();

    const [busy, setBusy] = useState(false);

    const source = customer && customer.sources.data.length > 0 ? customer.sources.data[0] : null;
    const subscription = customer && customer.subscriptions.data.length > 0 ? customer.subscriptions.data[0] : null;

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

            console.debug('Proration', proration);

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

                        if (subscription.status === 'incomplete') {
                            const invoice = await stripeApi.getCurrentSubscriptionLatestInvoice();
                            console.debug('Invoice', invoice);

                            if (invoice.payment_intent.status === 'requires_action') {
                                const cardPaymentResult = await stripe.handleCardPayment(invoice.payment_intent.client_secret);
                                console.debug('Handle Card Payment', cardPaymentResult);
                            }
                        }

                        const customer = await stripeApi.getCurrentCustomer();
                        onCustomerUpdated(customer);
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
                                <Button onClick={() => updateSubscription(true)} type="danger" size="small">Cancel subscription at period end</Button>
                            )}
                            {subscription && subscription.cancel_at_period_end && (
                                <Button onClick={() => updateSubscription(false)} type="primary" size="small">Resume subscription</Button>
                            )}
                        </React.Fragment>
                    )}>
                        {subscription ? subscription.plan.nickname : 'None'}
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