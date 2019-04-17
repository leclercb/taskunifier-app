import React from 'react';

function ResizableColumn(props) {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return (
            <th {...restProps} />
        );
    }

    return (
        <Resizable width={width} height={0} onResize={onResize}>
            <th {...restProps} />
        </Resizable>
    );
}

export default ResizableColumn;