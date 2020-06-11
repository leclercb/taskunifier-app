import l from 'utils/LogUtils';

export const logger = store => next => action => {
    l.info('Dispatching', action);
    const result = next(action);
    l.info('Next state', store.getState());
    return result;
};