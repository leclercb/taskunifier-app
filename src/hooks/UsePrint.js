import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { printNotes, printTasks } from 'actions/PrintActions';

export function usePrint() {
    const dispatch = useDispatch();

    const printNotesCallback = useCallback(
        contact => dispatch(printNotes(contact)),
        [dispatch]
    );

    const printTasksCallback = useCallback(
        contact => dispatch(printTasks(contact)),
        [dispatch]
    );

    return {
        printNotes: printNotesCallback,
        printTasks: printTasksCallback
    };
}