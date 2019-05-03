import React from 'react';
import PropTypes from 'prop-types';
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
            <th {...restProps} style={{
                userSelect: 'none',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: width - 12
            }} />
        </Resizable>
    );
}

ResizableColumn.propTypes = {
    width: PropTypes.number,
    onResize: PropTypes.func
};

export default ResizableColumn;