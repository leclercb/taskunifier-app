import moment from 'moment';

function applyTemplate(template, object, fields) {
    if (!template) {
        return;
    }

    Object.keys(template.properties).forEach(key => {
        let value = template.properties[key];
        const field = fields.find(field => field.id === key);

        if (value && field) {
            if (field.type === 'date' || field.type === 'dateTime') {
                if (Number.isInteger(value)) {
                    value = moment().add(value, 'day').toISOString();
                }
            }

            object[key] = value;
        }
    });
}

export function applyNoteTemplate(noteTemplate, note, noteFields) {
    applyTemplate(noteTemplate, note, noteFields);
}

export function applyNoteTemplateFromNoteFilter(noteFilter, note, noteFields) {
    const noteTemplate = noteFilter.noteTemplate;

    applyNoteTemplate(noteTemplate, note, noteFields);
}

export function applyTaskTemplate(taskTemplate, task, taskFields) {
    applyTemplate(taskTemplate, task, taskFields);
}

export function applyTaskTemplateFromTaskFilter(taskFilter, taskTemplates, task, taskFields) {
    let taskTemplate = taskFilter.taskTemplate;

    if (typeof taskTemplate === 'string') {
        taskTemplate = taskTemplates.find(taskTemplate => taskTemplate.id === taskTemplate);
    }

    applyTaskTemplate(taskTemplate, task, taskFields);
}