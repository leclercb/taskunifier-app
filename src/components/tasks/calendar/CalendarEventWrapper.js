import React from 'react';
import PropTypes from 'prop-types';
import { getImportanceColor } from 'utils/SettingUtils';

function CalendarEventWrapper({ event, children }) {
    let className;

    if (event.selected) {
        className = 'wrapper-selected';
    } else if (event.mode === 'startDate') {
        className = 'wrapper-start-date';
    } else {
        className = 'wrapper-due-date';
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