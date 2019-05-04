import moment from 'moment';
import { getDefaultNoteFields } from 'data/DataNoteFields';
import { getDefaultSelectedNoteFilter } from 'data/DataNoteFilters';
import { filterObjects } from 'utils/CategoryUtils';
import { applyFilter } from 'utils/FilterUtils';
import { deleteTag, updateTag } from 'utils/TagUtils';

const getFilteredNotes = (state, action) => {
    const fields = getDefaultNoteFields(action.settings).concat(filterObjects(action.noteFields.all));

    return state.all.filter(note => {
        if (!state.selectedNoteFilterDate ||
            moment(note.creationDate).isAfter(moment(state.selectedNoteFilterDate))) {
            return true;
        }

        return applyFilter(state.selectedNoteFilter, note, fields);
    });
}

const Notes = () => (state = {
    all: [],
    filtered: [],
    selectedNoteIds: [],
    selectedNoteFilter: getDefaultSelectedNoteFilter(),
    selectedNoteFilterDate: null
}, action) => {
    switch (action.type) {
        case 'SET_OBJECTS':
        case 'ADD_OBJECT':
        case 'UPDATE_OBJECT':
        case 'UPDATE_HIERARCHY':
        case 'DELETE_OBJECT':
        case 'CLEAN_OBJECTS': {
            if (action.property !== 'notes') {
                return state;
            }

            return {
                ...state,
                filtered: getFilteredNotes(state, action)
            };
        }
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

            newState.filtered = getFilteredNotes(newState, action);

            return newState;
        }
        case 'UPDATE_TAG': {
            return {
                ...state,
                all: state.all.map(note => {
                    if (note.state === 'LOADED' || note.state === 'TO_UPDATE') {
                        note = { ...note };
                        updateTag(note, action.tag.id, action.tag.title);
                        note.updateDate = action.updateDate;
                        note.state = 'TO_UPDATE';
                    }

                    return note;
                })
            };
        }
        case 'DELETE_TAG': {
            return {
                ...state,
                all: state.all.map(note => {
                    if (note.state === 'LOADED' || note.state === 'TO_UPDATE') {
                        note = { ...note };
                        deleteTag(note, action.tagId);
                        note.updateDate = action.updateDate;
                        note.state = 'TO_UPDATE';
                    }

                    return note;
                })
            };
        }
        default:
            return state;
    }
};

export default Notes;