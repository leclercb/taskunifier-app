import { updateTag, deleteTag } from '../utils/TagUtils';

const Notes = () => (state = [], action) => {
    switch (action.type) {
        case 'UPDATE_TAG': {
            const notes = [
                ...state
            ];

            notes.forEach(note => {
                updateTag(note, action.tag.id, action.tag.title);
            });

            return notes;
        }
        case 'DELETE_TAG': {
            const notes = [
                ...state
            ];

            notes.forEach(note => {
                deleteTag(note, action.tagId);
            });

            return notes;
        }
        default:
            return state;
    }
}

export default Notes;