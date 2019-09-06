import moment from 'moment';
import { addLocation, deleteLocation, updateLocation } from 'actions/LocationActions';
import { sendRequest } from 'actions/RequestActions';
import { getConfig } from 'config/Config';
import { getLocations } from 'selectors/LocationSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeLocations() {
    return async (dispatch, getState) => {
        let locations = getLocations(getState());

        {
            const locationsToAdd = filterByVisibleState(locations).filter(location => !location.refIds.taskunifier);
            const locationsToAddPromises = locationsToAdd.map(location => dispatch(addRemoteLocation(location)));
            const result = await Promise.all(locationsToAddPromises);

            for (let location of result) {
                await dispatch(updateLocation(location, { loaded: true }));
            }
        }

        locations = getLocations(getState());

        {
            const locationsToDelete = locations.filter(location => !!location.refIds.taskunifier && location.state === 'TO_DELETE');
            const locationsToDeletePromises = locationsToDelete.map(location => dispatch(deleteRemoteLocation(location)));
            await Promise.all(locationsToDeletePromises);

            for (let location of locationsToDelete) {
                await dispatch(deleteLocation(location.id));
            }
        }

        locations = getLocations(getState());

        const remoteLocations = await dispatch(getRemoteLocations());

        for (let remoteLocation of remoteLocations) {
            const localLocation = locations.find(location => location.refIds.taskunifier === remoteLocation.refIds.taskunifier);

            if (!localLocation) {
                await dispatch(addLocation(remoteLocation, { keepRefIds: true }));
            } else {
                if (moment(remoteLocation.updateDate).diff(moment(localLocation.updateDate)) > 0) {
                    await dispatch(updateLocation(merge(localLocation, remoteLocation), { loaded: true }));
                }
            }
        }

        locations = getLocations(getState());

        // eslint-disable-next-line require-atomic-updates
        for (let localLocation of filterByVisibleState(locations)) {
            if (!remoteLocations.find(location => location.refIds.taskunifier === localLocation.refIds.taskunifier)) {
                await dispatch(deleteLocation(localLocation.id, { force: true }));
            }
        }

        locations = getLocations(getState());

        {
            const locationsToUpdate = locations.filter(location => !!location.refIds.taskunifier && location.state === 'TO_UPDATE');
            const locationsToUpdatePromises = locationsToUpdate.map(location => dispatch(editRemoteLocation(location)));
            await Promise.all(locationsToUpdatePromises);

            for (let location of locationsToUpdate) {
                await dispatch(updateLocation(location, { loaded: true }));
            }
        }
    };
}

export function getRemoteLocations(updatedAfter) {
    console.debug('getRemoteLocations');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'GET',
                url: `${getConfig().apiUrl}/v1/locations`,
                query: {
                    updatedAfter: updatedAfter ? updatedAfter.toISOString() : null
                }
            },
            settings);

        return result.data.map(location => convertLocationToLocal(location));
    };
}

export function addRemoteLocation(location) {
    console.debug('addRemoteLocation', location);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'POST',
                url: `${getConfig().apiUrl}/v1/locations`,
                data: convertLocationToRemote(location)
            },
            settings);

        return {
            ...location,
            refIds: {
                ...location.refIds,
                taskunifier: result.data.id
            }
        };
    };
}

export function editRemoteLocation(location) {
    console.debug('editRemoteLocation', location);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'PUT',
                url: `${getConfig().apiUrl}/v1/locations/${location.refIds.taskunifier}`,
                data: convertLocationToRemote(location)
            },
            settings);
    };
}

export function deleteRemoteLocation(location) {
    console.debug('deleteRemoteLocation', location);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        try {
            await sendRequest(
                {
                    headers: {
                        Authorization: `Bearer ${settings.taskunifier.accessToken}`
                    },
                    method: 'DELETE',
                    url: `${getConfig().apiUrl}/v1/locations/${location.refIds.taskunifier}`
                },
                settings);
        } catch (error) {
            // No throw exception if delete fails
            console.debug(error);
        }
    };
}

function convertLocationToRemote(location) {
    const remoteLocation = { ...location };

    delete remoteLocation.id;
    delete remoteLocation.refIds;
    delete remoteLocation.state;
    delete remoteLocation.creationDate;
    delete remoteLocation.updateDate;

    return remoteLocation;
}

function convertLocationToLocal(location) {
    const localLocation = {
        ...location,
        refIds: {
            taskunifier: location.id
        }
    };

    delete localLocation.id;
    delete localLocation.owner;

    return localLocation;
}