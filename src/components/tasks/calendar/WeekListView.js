import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { navigate } from 'react-big-calendar/lib/utils/constants';
import 'components/tasks/calendar/WeekListView.css';

function WeekListView({ accessors, components, date, events, localizer }) {
    const range = WeekListView.range(date);
    const { event: Event } = components;

    return (
        <table className="weekList">
            <thead>
                <tr>
                    {range.map(d => (
                        <th key={d.getTime()}>{localizer.format(d, 'agendaDateFormat')}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {range.map(d => (
                        <td key={d.getTime()}>
                            {events
                                .filter(event => moment(accessors.start(event)).isSame(moment(d), 'day'))
                                .map(event => {
                                    const id = accessors.id(event);
                                    const title = accessors.title(event);

                                    return (
                                        <div key={id}>{Event ? <Event event={event} title={title} /> : title}</div>
                                    );
                                })}
                        </td>
                    ))}
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

export default WeekListView;