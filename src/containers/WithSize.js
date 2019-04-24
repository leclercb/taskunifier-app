import React, { useEffect, useState, useRef } from 'react';
import { equals } from 'utils/ObjectUtils';

function withSize(Component) {
    function WithSize(props) {
        const [size, setSize] = useState({
            element: {
                width: 1024,
                height: 768
            },
            window: {
                width: 1024,
                height: 768
            }
        });

        const elementRef = useRef();

        const updateSize = () => {
            if (elementRef.current) {
                const newSize = {
                    element: {
                        width: elementRef.current.getBoundingClientRect().width,
                        height: elementRef.current.getBoundingClientRect().height
                    },
                    window: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                };

                if (!equals(size, newSize)) {
                    setSize(newSize);
                }
            }
        };

        useEffect(() => {
            updateSize();

            window.addEventListener('resize', updateSize);
            window.addEventListener('app-resize', updateSize);

            return () => {
                window.removeEventListener('resize', updateSize);
                window.removeEventListener('app-resize', updateSize);
            };
        });

        return (
            <span ref={elementRef}>
                <Component {...props} size={size} />
            </span>
        );
    }

    return WithSize;
}

export default withSize;