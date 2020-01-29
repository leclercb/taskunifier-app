import { createNoteFilterFromDefinition, getGeneralNoteFilters } from 'data/DataNoteFilters';
import { createTaskFilterFromDefinition, getGeneralTaskFilters } from 'data/DataTaskFilters';
import { getSearchNoteValue, getSearchTaskValue } from 'selectors/AppSelectors';
import { getContextsFilteredByVisibleState } from 'selectors/ContextSelectors';
import { getFoldersFilteredByNonArchived } from 'selectors/FolderSelectors';
import { getGoalsFilteredByNonArchived } from 'selectors/GoalSelectors';
import { getLocationsFilteredByVisibleState } from 'selectors/LocationSelectors';
import { getNoteFieldsIncludingDefaults } from 'selectors/NoteFieldSelectors';
import { getNoteFiltersFilteredByVisibleState } from 'selectors/NoteFilterSelectors';
import { getNotesFilteredByVisibleState } from 'selectors/NoteSelectors';
import {
    getCategoryNoteSorters,
    getCategoryTaskSorters,
    getCombinedNoteFilterDefinitions,
    getCombinedTaskFilterDefinitions,
    isShowCompletedTasks,
    isShowFutureTasks
} from 'selectors/SettingSelectors';
import { getTags } from 'selectors/TagSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';
import { getTaskFiltersFilteredByVisibleState } from 'selectors/TaskFilterSelectors';
import { getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';
import { store } from 'store/Store';
import NoteFilterCounterWorker from 'workers/NoteFilterCounter.worker.js';
import TaskFilterCounterWorker from 'workers/TaskFilterCounter.worker.js';

export function startNoteFilterCounterWorker(ms, callback) {
    const worker = new NoteFilterCounterWorker();

    worker.onmessage = event => {
        callback(event.data);
    };

    const interval = setInterval(() => {
        const state = store.getState();
        const filters = [...getNoteFiltersFilteredByVisibleState(state)];

        filters.push(...getGeneralNoteFilters());
        filters.push(...(getFoldersFilteredByNonArchived(state).map(folder => createNoteFilterFromDefinition({ id: folder.id, type: 'folder' }))));
        filters.push(...(getTags(state).map(tag => createNoteFilterFromDefinition({ id: tag.id, type: 'tags' }))));

        worker.postMessage({
            notes: getNotesFilteredByVisibleState(state),
            searchNoteValue: getSearchNoteValue(state),
            noteFields: getNoteFieldsIncludingDefaults(state),
            noteFilters: filters,
            combinedNoteFilterDefinitions: getCombinedNoteFilterDefinitions(state),
            categoryNoteSorters: getCategoryNoteSorters(state)
        });
    }, ms);

    return () => {
        clearInterval(interval);
        worker.terminate();
    };
}

export function startTaskFilterCounterWorker(ms, callback) {
    const worker = new TaskFilterCounterWorker();

    worker.onmessage = event => {
        callback(event.data);
    };

    const interval = setInterval(() => {
        const state = store.getState();
        const filters = [...getTaskFiltersFilteredByVisibleState(state)];

        filters.push(...getGeneralTaskFilters());
        filters.push(...(getContextsFilteredByVisibleState(state).map(context => createTaskFilterFromDefinition({ id: context.id, type: 'context' }))));
        filters.push(...(getFoldersFilteredByNonArchived(state).map(folder => createTaskFilterFromDefinition({ id: folder.id, type: 'folder' }))));
        filters.push(...(getGoalsFilteredByNonArchived(state).map(goal => createTaskFilterFromDefinition({ id: goal.id, type: 'goal' }))));
        filters.push(...(getLocationsFilteredByVisibleState(state).map(location => createTaskFilterFromDefinition({ id: location.id, type: 'location' }))));
        filters.push(...(getTags(state).map(tag => createTaskFilterFromDefinition({ id: tag.id, type: 'tags' }))));

        worker.postMessage({
            tasks: getTasksFilteredByVisibleState(state),
            searchTaskValue: getSearchTaskValue(state),
            showCompletedTasks: isShowCompletedTasks(state),
            showFutureTasks: isShowFutureTasks(state),
            taskFields: getTaskFieldsIncludingDefaults(state),
            taskFilters: filters,
            combinedTaskFilterDefinitions: getCombinedTaskFilterDefinitions(state),
            categoryTaskSorters: getCategoryTaskSorters(state)
        });
    }, ms);

    return () => {
        clearInterval(interval);
        worker.terminate();
    };
}