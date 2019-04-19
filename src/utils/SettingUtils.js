export const getImportanceColor = (importance, settings) => {
    return settings['importance_' + (importance ? importance : 0)];
}

export const getPriorityColor = (priority, settings) => {
    return settings['priority_' + (priority ? priority : 'negative')];
}

export const getStatusColor = (status, settings) => {
    return settings['status_' + (status ? status : 'negative')];
}