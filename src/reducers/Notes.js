import { deleteTag, updateTag } from 'utils/TagUtils';

const Notes = () => (state = [], action) => {
    switch (action.type) {
        case 'UPDATE_TAG': {
            return state.map(note => {
                if (note.state === 'LOADED' || note.state === 'TO_UPDATE') {
                    note = { ...note };
                    updateTag(note, action.tag.id, action.tag.title);
                    note.updateDate = action.updateDate;
                    note.state = 'TO_UPDATE';
                }

                return note;
            });
        }
        case 'DELETE_TAG': {
            return state.map(note => {
                if (note.state === 'LOADED' || note.state === 'TO_UPDATE') {
                    note = { ...note };
                    deleteTag(note, action.tagId);
                    note.updateDate = action.updateDate;
                    note.state = 'TO_UPDATE';
                }

                return note;
            });
        }
        default:
            return state;
    }
};

export default Notes;