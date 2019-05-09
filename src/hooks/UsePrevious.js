import { useEffect, useRef } from 'react';

export function usePrevious(value, updateOnRender = true) {
    const ref = useRef();

    if (updateOnRender) {
        const prev = ref.current;
        ref.current = value;
        return prev;
    } else {
        useEffect(() => {
            ref.current = value;
        });

        return ref.current;
    }
};