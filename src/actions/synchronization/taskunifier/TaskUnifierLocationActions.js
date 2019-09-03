import moment from 'moment';
import { addLocation, deleteLocation, updateLocation } from 'actions/LocationActions';
import { sendRequest } from 'actions/RequestActions';
import { checkResult } from 'actions/synchronization/taskunifier/ExceptionHandler';
import { getLocations } from 'selectors/LocationSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getTaskUnifierAccountInfo } from 'selectors/SynchronizationSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeLocations() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

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

        {
            const lastSync = settings.lastSynchronizationDate ? moment(settings.lastSynchronizationDate) : null;
            const lastEditLocation = moment.unix(getTaskUnifierAccountInfo(getState()).lastedit_location);

            if (!lastSync || lastEditLocation.diff(lastSync) > 0) {
                const remoteLocations = await dispatch(getRemoteLocations());

                for (let remoteLocation of remoteLocations) {
                    const localLocation = locations.find(location => location.refIds.taskunifier === remoteLocation.refIds.taskunifier);

                    if (!localLocation) {
                        await dispatch(addLocation(remoteLocation, { keepRefIds: true }));
                    } else {
                        await dispatch(updateLocation(merge(localLocation, remoteLocation), { loaded: true }));
                    }
                }

                locations = getLocations(getState());

                for (let localLocation of filterByVisibleState(locations)) {
                    if (!remoteLocations.find(location => location.refIds.taskunifier === localLocation.refIds.taskunifier)) {
                        await dispatch(deleteLocation(localLocation.id, { force: true }));
                    }
                }
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

export function getRemoteLocations() {
    console.debug('getRemoteLocations');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                method: 'GET',
                url: 'https://api.taskunifier.com/3/locations/get.php',
                params: {
                    access_token: settings.taskunifier.accessToken
                }
            },
            settings);

        checkResult(result);

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
                method: 'POST',
                url: 'https://api.taskunifier.com/3/locations/add.php',
                params: {
                    access_token: settings.taskunifier.accessToken,
                    ...convertLocationToRemote(location)
                }
            },
            settings);

        checkResult(result);

        return {
            ...location,
            refIds: {
                ...location.refIds,
                taskunifier: result.data[0].id
            }
        };
    };
}

export function editRemoteLocation(location) {
    console.debug('editRemoteLocation', location);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                method: 'POST',
                url: 'https://api.taskunifier.com/3/locations/edit.php',
                params: {
                    access_token: settings.taskunifier.accessToken,
                    ...convertLocationToRemote(location)
                }
            },
            settings);

        checkResult(result);
    };
}

export function deleteRemoteLocation(location) {
    console.debug('deleteRemoteLocation', location);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await sendRequest(
            {
                method: 'POST',
                url: 'https://api.taskunifier.com/3/locations/delete.php',
                params: {
                    access_token: settings.taskunifier.accessToken,
                    id: location.refIds.taskunifier
                }
            },
            settings);

        // checkResult(result);
    };
}

function convertLocationToRemote(location) {
    return {
        id: location.refIds.taskunifier,
        name: location.title,
        description: location.description,
        lat: location.latitude, // TODO lat & lon should be numbers
        lon: location.longitude
    };
}

function convertLocationToLocal(location) {
    return {
        refIds: {
            taskunifier: location.id
        },
        title: location.name,
        description: location.description,
        latitude: `${location.lat}`,
        longitude: `${location.lon}`
    };
}