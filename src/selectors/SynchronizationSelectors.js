export const isSynchronizing = state => state.synchronizing;
export const getSynchronization = state => state.synchronization;
export const getSynchronizationData = (state, application) => state.synchronization.data[application];

export const getTaskUnifierData = state => state.synchronization.data.taskunifier;
export const getTaskUnifierAccountInfo = state => state.synchronization.data.taskunifier.accountInfo;

export const getToodledoData = state => state.synchronization.data.toodledo;
export const getToodledoAccountInfo = state => state.synchronization.data.toodledo.accountInfo;