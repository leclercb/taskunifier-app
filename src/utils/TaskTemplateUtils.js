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

export function applyTaskTemplateFromTaskFilter(taskFilter, taskTemplates, task) {
    let taskTemplate = taskFilter.taskTemplate;

    if (typeof taskTemplate === 'string') {
        taskTemplate = taskTemplates.find(taskTemplate => taskTemplate.id === taskTemplate);
    }

    applyTaskTemplate(taskTemplate, task);
}