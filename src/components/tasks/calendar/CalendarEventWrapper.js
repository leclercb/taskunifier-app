import React from 'react';
import PropTypes from 'prop-types';
import { getImportanceColor } from 'utils/SettingUtils';

function CalendarEventWrapper({ event, children }) {
    let className = 'wrapper-' + event.type;

    if (event.selected) {
        className += ' wrapper-selected';
    }

    return (
        <div
            className={className}
            style={{
                backgroundColor: getImportanceColor(event.task.importance, event.settings)
            }}>
            {children}
        </div>
    );
}

CalendarEventWrapper.propTypes = {
    event: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
};

export default CalendarEventWrapper;