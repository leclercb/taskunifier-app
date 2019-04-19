import { updateTag, deleteTag } from '../utils/TagUtils';

const Tasks = () => (state = [], action) => {
    switch (action.type) {
        case 'UPDATE_TAG': {
            const tasks = [
                ...state
            ];

            tasks.forEach(task => {
                updateTag(task, action.tag.id, action.tag.title);
            });

            return tasks;
        }
        case 'DELETE_TAG': {
            const tasks = [
                ...state
            ];

            tasks.forEach(task => {
                deleteTag(task, action.tagId);
            });

            return tasks;
        }
        default:
            return state;
    }
}

export default Tasks;