import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { printNotes, printTasks } from 'actions/PrintActions';

export function usePrintApi() {
    const dispatch = useDispatch();

    const printNotesCallback = useCallback(
        notes => dispatch(printNotes(notes)),
        [dispatch]
    );

    const printTasksCallback = useCallback(
        tasks => dispatch(printTasks(tasks)),
        [dispatch]
    );

    return {
        printNotes: printNotesCallback,
        printTasks: printTasksCallback
    };
}