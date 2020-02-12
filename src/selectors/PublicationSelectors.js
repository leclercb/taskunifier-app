export const isPublishing = state => state.publishing;
export const getPublication = state => state.publication;
export const getPublicationData = (state, application) => state.publication.data[application];

export const getGoogleCalData = state => state.publication.data.googlecal;
export const getGoogleCalAccountInfo = state => state.publication.data.googlecal.accountInfo;