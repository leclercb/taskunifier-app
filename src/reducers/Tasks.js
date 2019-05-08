import { deleteTag, updateTag } from 'utils/TagUtils';

const Tasks = () => (state = [], action) => {
    switch (action.type) {
        case 'UPDATE_TAG': {
            return state.map(task => {
                if (task.state === 'LOADED' || task.state === 'TO_UPDATE') {
                    task = { ...task };
                    updateTag(task, action.tag.id, action.tag.title);
                    task.updateDate = action.updateDate;
                    task.state = 'TO_UPDATE';
                }

                return task;
            });
        }
        case 'DELETE_TAG': {
            return state.map(task => {
                if (task.state === 'LOADED' || task.state === 'TO_UPDATE') {
                    task = { ...task };
                    deleteTag(task, action.tagId);
                    task.updateDate = action.updateDate;
                    task.state = 'TO_UPDATE';
                }

                return task;
            });
        }
        default:
            return state;
    }
};

export default Tasks;