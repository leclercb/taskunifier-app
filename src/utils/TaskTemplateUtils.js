export function applyTaskTemplate(taskTemplate, task) {
    if (!taskTemplate) {
        return;
    }

    Object.keys(taskTemplate.properties).forEach(key => {
        const value = taskTemplate.properties[key];

        if (value) {
            task[key] = value;
        }
    });
}