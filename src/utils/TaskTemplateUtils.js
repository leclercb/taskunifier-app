import moment from 'moment';

export function applyTaskTemplate(taskTemplate, task, taskFields) {
    if (!taskTemplate) {
        return;
    }

    Object.keys(taskTemplate.properties).forEach(key => {
        let value = taskTemplate.properties[key];
        const field = taskFields.find(field => field.id === key);

        if (value && field) {
            if (field.type === 'date' || field.type === 'dateTime') {
                if (Number.isInteger(value)) {
                    value = moment().add(value, 'day').toISOString();
                }
            }

            task[key] = value;
        }
    });
}

export function applyTaskTemplateFromTaskFilter(taskFilter, taskTemplates, task, taskFields) {
    let taskTemplate = taskFilter.taskTemplate;

    if (typeof taskTemplate === 'string') {
        taskTemplate = taskTemplates.find(taskTemplate => taskTemplate.id === taskTemplate);
    }

    applyTaskTemplate(taskTemplate, task, taskFields);
}