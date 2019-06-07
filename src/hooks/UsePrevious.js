import { useEffect, useRef } from 'react';

export function usePrevious(value, updateOnRender = true) {
    const ref = useRef();

    useEffect(() => {
        if (!updateOnRender) {
            ref.current = value;
        }
    });

    if (updateOnRender) {
        const prev = ref.current;
        ref.current = value;
        return prev;
    }

    return ref.current;
}