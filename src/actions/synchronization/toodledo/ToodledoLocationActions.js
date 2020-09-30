import moment from 'moment';
import qs from 'qs';
import { addLocation, deleteLocation, updateLocation } from 'actions/LocationActions';
import { sendRequest } from 'actions/RequestActions';
import { checkResult } from 'actions/synchronization/toodledo/ExceptionHandler';
import { getLocations } from 'selectors/LocationSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getToodledoAccountInfo } from 'selectors/SynchronizationSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import logger from 'utils/LogUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeLocations() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        let locations = getLocations(getState());

        {
            const locationsToAdd = filterByVisibleState(locations).filter(location => !location.refIds.toodledo);
            const locationsToAddPromises = locationsToAdd.map(location => dispatch(addRemoteLocation(location)));
            const result = await Promise.all(locationsToAddPromises);

            await dispatch(updateLocation(result, { loaded: true, skipUpdateMiddleware: true }));
        }

        locations = getLocations(getState());

        {
            const locationsToDelete = locations.filter(location => !!location.refIds.toodledo && location.state === 'TO_DELETE');
            const locationsToDeletePromises = locationsToDelete.map(location => dispatch(deleteRemoteLocation(location)));
            await Promise.all(locationsToDeletePromises);

            await dispatch(deleteLocation(locationsToDelete.map(location => location.id)));
        }

        locations = getLocations(getState());

        {
            const lastSync = settings.lastSynchronizationDate ? moment(settings.lastSynchronizationDate) : null;
            const lastEditLocation = moment.unix(getToodledoAccountInfo(getState()).lastedit_location);

            if (!lastSync || lastEditLocation.diff(lastSync) > 0) {
                const locationsToAdd = [];
                const locationsToUpdate = [];
                const locationsToDelete = [];
                const remoteLocations = await dispatch(getRemoteLocations());

                for (let remoteLocation of remoteLocations) {
                    const localLocation = locations.find(location => location.refIds.toodledo === remoteLocation.refIds.toodledo);

                    if (!localLocation) {
                        locationsToAdd.push(remoteLocation);
                    } else {
                        locationsToUpdate.push(merge(localLocation, remoteLocation));
                    }
                }

                await dispatch(addLocation(locationsToAdd, { keepRefIds: true }));
                await dispatch(updateLocation(locationsToUpdate, { loaded: true, skipUpdateMiddleware: true }));

                locations = getLocations(getState());

                // eslint-disable-next-line require-atomic-updates
                for (let localLocation of filterByVisibleState(locations)) {
                    if (!remoteLocations.find(location => location.refIds.toodledo === localLocation.refIds.toodledo)) {
                        locationsToDelete.push(localLocation);
                    }
                }

                await dispatch(deleteLocation(locationsToDelete.map(location => location.id), { force: true }));
            }
        }

        locations = getLocations(getState());

        {
            const locationsToUpdate = locations.filter(location => !!location.refIds.toodledo && location.state === 'TO_UPDATE');
            const locationsToUpdatePromises = locationsToUpdate.map(location => dispatch(editRemoteLocation(location)));
            await Promise.all(locationsToUpdatePromises);

            await dispatch(updateLocation(locationsToUpdate, { loaded: true, skipUpdateMiddleware: true }));
        }
    };
}

export function getRemoteLocations() {
    logger.debug('Get remote locations');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: 'https://api.toodledo.com/3/locations/get.php',
                data: qs.stringify({
                    access_token: settings.toodledo.accessToken
                })
            },
            settings);

        checkResult(result);

        return result.data.map(location => convertLocationToLocal(location));
    };
}

export function addRemoteLocation(location) {
    logger.debug('Add remote location', location.id);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: 'https://api.toodledo.com/3/locations/add.php',
                data: qs.stringify({
                    access_token: settings.toodledo.accessToken,
                    ...convertLocationToRemote(location)
                })
            },
            settings);

        checkResult(result);

        return {
            ...location,
            refIds: {
                ...location.refIds,
                toodledo: result.data[0].id
            }
        };
    };
}

export function editRemoteLocation(location) {
    logger.debug('Edit remote location', location.id);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: 'https://api.toodledo.com/3/locations/edit.php',
                data: qs.stringify({
                    access_token: settings.toodledo.accessToken,
                    ...convertLocationToRemote(location)
                })
            },
            settings);

        checkResult(result);
    };
}

export function deleteRemoteLocation(location) {
    logger.debug('Delete remote location', location.id);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await sendRequest(
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: 'https://api.toodledo.com/3/locations/delete.php',
                data: qs.stringify({
                    access_token: settings.toodledo.accessToken,
                    id: location.refIds.toodledo
                })
            },
            settings);

        // checkResult(result);
    };
}

function convertLocationToRemote(location) {
    return {
        id: location.refIds.toodledo,
        name: location.title,
        description: location.description,
        lat: location.latitude, // TODO lat & lon should be numbers
        lon: location.longitude
    };
}

function convertLocationToLocal(location) {
    return {
        refIds: {
            toodledo: location.id
        },
        title: location.name,
        description: location.description,
        latitude: `${location.lat}`,
        longitude: `${location.lon}`
    };
}