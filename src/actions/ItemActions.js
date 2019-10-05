import uuid from 'uuid/v4';
import { sendRequest } from 'actions/RequestActions';
import { updateProcess } from 'actions/ThreadActions';
import { getConfig } from 'config/Config';

export function buyItem(itemSku, user, email) {
    return async dispatch => {
        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: 'Redirecting to Paypal'
        }));

        try {
            const result = await sendRequest({
                method: 'POST',
                url: `${getConfig().apiUrl}/v1/items/buy`,
                responseType: 'json',
                data: {
                    itemSku,
                    user,
                    email
                }
            });

            const approveLink = result.data.links.find(link => link.rel === 'approve').href;
            window.location.href = approveLink;

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
            }));

            throw error;
        }
    };
}