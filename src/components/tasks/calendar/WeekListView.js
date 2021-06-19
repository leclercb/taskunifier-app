import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { navigate } from 'react-big-calendar/lib/utils/constants';
import { useDrag, useDrop } from 'react-dnd';
import CalendarEventWrapper from 'components/tasks/calendar/CalendarEventWrapper';
import { useTaskApi } from 'hooks/UseTaskApi';
import 'components/tasks/calendar/WeekListView.css';

function WeekListView(props) {
    const taskApi = useTaskApi();

    const range = WeekListView.range(props.date);

    return (
        <table className="weekList">
            <thead>
                <tr>
                    {range.map(date => (
                        <th key={date.getTime()}>{props.localizer.format(date, 'agendaDateFormat')}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {range.map(date => (<WeekListColumn key={date.getTime()} {...props} date={date} taskApi={taskApi} />))}
                </tr>
            </tbody>
        </table>
    );
}

WeekListView.propTypes = {
    accessors: PropTypes.object.isRequired,
    components: PropTypes.object.isRequired,
    date: PropTypes.instanceOf(Date),
    events: PropTypes.array,
    getters: PropTypes.object.isRequired,
    localizer: PropTypes.object.isRequired,
    selected: PropTypes.object
};

WeekListView.range = date => {
    const start = moment(date).startOf('week');
    return [...Array(7)].map((_, i) => moment(start).add(i, 'day').toDate());
};

WeekListView.navigate = (date, action) => {
    switch (action) {
        case navigate.PREVIOUS:
            return moment(date).add(-1, 'week').toDate();
        case navigate.NEXT:
            return moment(date).add(1, 'week').toDate();
        default:
            return date;
    }
};

WeekListView.title = (date, { localizer }) => {
    const start = moment(date).startOf('week').toDate();
    const end = moment(date).endOf('week').toDate();
    return localizer.format({ start, end }, 'agendaHeaderFormat');
};

function WeekListColumn(props) {
    const { accessors, date, events, taskApi } = props;

    const [collectedDropProps, drop] = useDrop({
        accept: 'calendar-event',
        drop: item => {
            const dropDate = moment(date);
            const type = item.data.type;
            const task = item.data.task;

            if (type === 'startDate' || type === 'dueDate') {
                const newDate = moment(task[type]);
                newDate.set('day', dropDate.get('day'));
                newDate.set('month', dropDate.get('month'));
                newDate.set('year', dropDate.get('year'));

                taskApi.updateTask({
                    ...task,
                    [type]: newDate.toISOString()
                });
            }
        },
        collect: monitor => ({
            hovered: monitor.isOver()
        })
    });

    return (
        <td ref={drop} className={collectedDropProps.hovered ? 'hovered' : null}>
            {events
                .filter(event => moment(accessors.start(event)).isSame(moment(date), 'day'))
                .map(event => (<WeekListCell key={event.id} {...props} event={event} />))}
        </td>
    );
}

WeekListColumn.propTypes = {
    accessors: PropTypes.object.isRequired,
    date: PropTypes.instanceOf(Date),
    events: PropTypes.array,
    taskApi: PropTypes.object
};

function WeekListCell({ components, event, onDoubleClickEvent, onSelectEvent }) {
    const { event: Event } = components;

    // eslint-disable-next-line no-unused-vars
    const [collectedDragProps, drag] = useDrag({
        type: 'calendar-event',
        item: {
            data: event
        }
    });

    return (
        <CalendarEventWrapper event={event}>
            <div
                className="rbc-event"
                ref={drag}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectEvent(event)}
                onDoubleClick={() => onDoubleClickEvent(event)}>
                <Event event={event} />
            </div>
        </CalendarEventWrapper>
    );
}

WeekListCell.propTypes = {
    accessors: PropTypes.object.isRequired,
    components: PropTypes.object.isRequired,
    event: PropTypes.object,
    onDoubleClickEvent: PropTypes.func.isRequired,
    onSelectEvent: PropTypes.func.isRequired
};

export default WeekListView;