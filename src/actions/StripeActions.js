import { Auth } from 'aws-amplify';
import { v4 as uuid } from 'uuid';
import { sendRequest } from 'actions/RequestActions';
import { updateProcess } from 'actions/ThreadActions';
import { getConfig } from 'config/Config';

export function getPlans(productId) {
    return async dispatch => {
        const processId = uuid();

        try {
            const result = await sendRequest({
                headers: {
                    Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
                },
                method: 'GET',
                url: `${getConfig().apiUrl}/v1/stripe/products/${productId}/plans`,
                responseType: 'json'
            });

            return result.data;
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: 'Get plans',
                error: error.toString()
            }));

            throw error;
        }
    };
}

export function getCurrentCustomer() {
    return async dispatch => {
        const processId = uuid();

        try {
            const result = await sendRequest({
                headers: {
                    Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
                },
                method: 'GET',
                url: `${getConfig().apiUrl}/v1/stripe/customers/current`,
                responseType: 'json'
            });

            return result.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return null;
            }

            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: 'Get customer',
                error: error.toString()
            }));

            throw error;
        }
    };
}

export function setCurrentCustomer(customer) {
    return async dispatch => {
        const processId = uuid();

        try {
            const result = await sendRequest({
                headers: {
                    Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
                },
                method: 'PUT',
                url: `${getConfig().apiUrl}/v1/stripe/customers/current`,
                responseType: 'json',
                data: customer
            });

            return result.data;
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: 'Set customer',
                error: error.toString()
            }));

            throw error;
        }
    };
}

export function setCurrentCustomerSource(source) {
    return async dispatch => {
        const processId = uuid();

        try {
            const result = await sendRequest({
                headers: {
                    Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
                },
                method: 'PUT',
                url: `${getConfig().apiUrl}/v1/stripe/customers/current/sources/current`,
                responseType: 'json',
                data: source
            });

            return result.data;
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: 'Set customer source',
                error: error.toString()
            }));

            throw error;
        }
    };
}

export function updateCurrentSubscription(subscription) {
    return async dispatch => {
        const processId = uuid();

        try {
            const result = await sendRequest({
                headers: {
                    Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
                },
                method: 'PUT',
                url: `${getConfig().apiUrl}/v1/stripe/subscriptions/current`,
                responseType: 'json',
                data: subscription
            });

            return result.data;
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: 'Update subscription',
                error: error.toString()
            }));

            throw error;
        }
    };
}

export function getCurrentSubscriptionLatestInvoice() {
    return async dispatch => {
        const processId = uuid();

        try {
            const result = await sendRequest({
                headers: {
                    Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
                },
                method: 'GET',
                url: `${getConfig().apiUrl}/v1/stripe/subscriptions/current/invoices/latest`,
                responseType: 'json'
            });

            return result.data;
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: 'Get latest invoice',
                error: error.toString()
            }));

            throw error;
        }
    };
}

export function setCurrentSubscriptionPlan(planId, quantity) {
    return async dispatch => {
        const processId = uuid();

        try {
            const result = await sendRequest({
                headers: {
                    Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
                },
                method: 'PUT',
                url: `${getConfig().apiUrl}/v1/stripe/subscriptions/current/plans/${planId}`,
                responseType: 'json',
                data: {
                    quantity
                }
            });

            return result.data;
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: 'Select subscription plan',
                error: error.toString()
            }));

            throw error;
        }
    };
}

export function getCurrentSubscriptionPlanProration(planId, quantity) {
    return async dispatch => {
        const processId = uuid();

        try {
            const result = await sendRequest({
                headers: {
                    Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
                },
                method: 'POST',
                url: `${getConfig().apiUrl}/v1/stripe/subscriptions/current/plans/${planId}/proration`,
                responseType: 'json',
                data: {
                    quantity
                }
            });

            return result.data;
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: 'Get subscription plan proration',
                error: error.toString()
            }));

            throw error;
        }
    };
}