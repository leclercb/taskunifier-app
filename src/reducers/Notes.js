import { getDefaultSelectedNoteFilter } from 'data/DataNoteFilters';
import { deleteTag, updateTag } from 'utils/TagUtils';

const Notes = () => (state = {
    all: [],
    selectedNoteIds: [],
    selectedNoteFilter: getDefaultSelectedNoteFilter(),
    selectedNoteFilterDate: null
}, action) => {
    switch (action.type) {
        case 'SET_SELECTED_NOTE_IDS': {
            return {
                ...state,
                selectedNoteIds: action.noteIds
            };
        }
        case 'SET_SELECTED_NOTE_FILTER': {
            const newState = {
                ...state,
                selectedNoteFilter: action.noteFilter,
                selectedNoteFilterDate: action.date
            };

            return newState;
        }
        case 'UPDATE_TAG': {
            const newObjects = state.all.map(note => {
                if (note.state === 'LOADED' || note.state === 'TO_UPDATE') {
                    note = { ...note };
                    updateTag(note, action.tag.id, action.tag.title);
                    note.updateDate = action.updateDate;
                    note.state = 'TO_UPDATE';
                }

                return note;
            });

            const newState = {
                ...state,
                all: newObjects
            };

            return newState;
        }
        case 'DELETE_TAG': {
            const newObjects = state.all.map(note => {
                if (note.state === 'LOADED' || note.state === 'TO_UPDATE') {
                    note = { ...note };
                    deleteTag(note, action.tagId);
                    note.updateDate = action.updateDate;
                    note.state = 'TO_UPDATE';
                }

                return note;
            });

            const newState = {
                ...state,
                all: newObjects
            };

            return newState;
        }
        default:
            return state;
    }
};

export default Notes;