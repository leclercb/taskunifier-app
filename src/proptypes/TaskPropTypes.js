import PropTypes from 'prop-types';
import { LinkedContactPropType } from 'proptypes/LinkedContactPropTypes';
import { LinkedFilePropType } from 'proptypes/LinkedFilePropTypes';
import { LinkedTaskPropType } from 'proptypes/LinkedTaskPropTypes';
import { RepeatPropType } from 'proptypes/RepeatPropTypes';
import { TimerPropType } from 'proptypes/TimerPropTypes';

export const TaskPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    star: PropTypes.bool,
    completed: PropTypes.bool,
    progress: PropTypes.number,
    length: PropTypes.number,
    timer: TimerPropType,
    priority: PropTypes.string,
    importance: PropTypes.number,
    status: PropTypes.string,
    startDate: PropTypes.string,
    dueDate: PropTypes.string,
    completionDate: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string.isRequired),
    parent: PropTypes.string,
    context: PropTypes.string,
    folder: PropTypes.string,
    goal: PropTypes.string,
    location: PropTypes.string,
    repeat: RepeatPropType,
    note: PropTypes.string,
    linkedContacts: PropTypes.arrayOf(LinkedContactPropType.isRequired),
    linkedFiles: PropTypes.arrayOf(LinkedFilePropType.isRequired),
    linkedTasks: PropTypes.arrayOf(LinkedTaskPropType.isRequired)
});

export const TaskMetaDataPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    parents: PropTypes.arrayOf(TaskPropType.isRequired).isRequired,
    children: PropTypes.arrayOf(TaskPropType.isRequired).isRequired
});