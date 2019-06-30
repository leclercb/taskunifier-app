import { getTestApi } from 'api/TestApi';

export function initializeApi() {
    window.taskunifier = {};
    window.taskunifier.test = getTestApi();
}