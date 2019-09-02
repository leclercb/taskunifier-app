export const isSynchronizing = state => state.synchronizing;
export const getSynchronization = state => state.synchronization;
export const getSynchronizationData = (state, application) => state.synchronization.data[application];

export const getToodledoData = state => state.synchronization.data.toodledo;
export const getToodledoAccountInfo = state => state.synchronization.data.toodledo.accountInfo;