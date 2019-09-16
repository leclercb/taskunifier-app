import { getConfig } from 'config/Config';

export function getErrorMessages(error, redirect = false) {
    if (!error) {
        return ['Unknown error'];
    }

    if (!error.response || !error.response.data) {
        return [error.toString()];
    }

    switch (error.response.data.code) {
        case 'input_validation_errors':
            return error.response.data.validationErrors.errors.map(error => 'Validation error: ' + error);
        case 'maintenance_ongoing':
            if (redirect) {
                window.location.href = getConfig().maintenanceUrl;
            }

            return [error.response.data.message];
        default:
            return [error.response.data.message || error.toString()];
    }
}