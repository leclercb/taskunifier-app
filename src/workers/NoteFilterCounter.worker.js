import {
    combineConditions,
    createNoteFilterFromDefinition,
    createSearchNoteValueCondition
} from 'data/DataNoteFilters';
import { applyFilter } from 'utils/FilterUtils';

onmessage = function (event) {
    const data = event.data;
    const counts = {};

    data.noteFilters.forEach(filter => {
        counts[filter.id] = getCount(
            data.notes,
            data.searchNoteValue,
            filter,
            data.noteFields,
            data.noteFilters,
            data.combinedNoteFilterDefinitions,
            data.categoryNoteSorters
        );
    });

    postMessage(counts);
};

function getCount(notes, searchNoteValue, selectedNoteFilter, noteFields, noteFilters, combinedNoteFilterDefinitions, categoryNoteSorters) {
    const extraConditions = [];

    if (searchNoteValue) {
        extraConditions.push(createSearchNoteValueCondition(searchNoteValue));
    }

    (combinedNoteFilterDefinitions || []).forEach(filterDefinition => {
        const filter = createNoteFilterFromDefinition(filterDefinition, noteFilters, categoryNoteSorters);

        if (filter) {
            extraConditions.push(filter.condition);
        }
    });

    selectedNoteFilter = combineConditions(selectedNoteFilter, extraConditions);

    const filteredNotes = notes.filter(note => applyFilter(selectedNoteFilter, note, noteFields));

    return filteredNotes.length;
}