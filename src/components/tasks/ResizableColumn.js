import React from 'react';
import { Resizable } from 'react-resizable';

function ResizableColumn(props) {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return (
            <th {...restProps} />
        );
    }

    return (
        <Resizable width={width} height={0} onResize={onResize}>
            <th {...restProps} style={{ userSelect: 'none' }} />
        </Resizable>
    );
}

export default ResizableColumn;