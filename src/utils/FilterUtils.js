export const applyFilter = (filter, fields, tasks) => {
    if (!filter || !filter.condition) {
        return tasks;
    }
    
    return applyCondition(filter.condition, fields, tasks);
}

const applyCondition = (condition, fields, tasks) => {
    const field = fields.find(field => field.id === condition.field);

    return tasks;
}