import { google } from 'googleapis';
import moment from 'moment';
import { getClient } from 'actions/publication/googlecal/GoogleCalAuthorizationActions';
import { getLocationsFilteredByVisibleState } from 'selectors/LocationSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';
import { equals } from 'utils/ObjectUtils';

export function publishEvents() {
    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);
        const locations = getLocationsFilteredByVisibleState(state);
        const tasks = getTasksFilteredByVisibleState(state);

        const calendarName = settings.googlecalCalendarName;

        const showStartTime = settings.showStartTime;
        const showDueTime = settings.showDueTime;

        const publishCompletedTaskEvents = settings.googlecalPublishCompletedTaskEvents;
        const publishStartDateEvents = settings.googlecalPublishStartDateEvents;
        const publishDueDateEvents = settings.googlecalPublishDueDateEvents;
        const publishWorkLogEvents = settings.googlecalPublishWorkLogEvents;
        const publishMaxDaysInPast = settings.googlecalPublishMaxDaysInPast;
        const publishMaxDaysInFuture = settings.googlecalPublishMaxDaysInFuture;

        const client = getClient(settings);

        const calendarClient = google.calendar({
            version: 'v3',
            auth: client
        });

        const calendarListResult = await calendarClient.calendarList.list();

        let calendar = calendarListResult.data.items.find(item => item.summary === calendarName);
        const events = [];

        if (calendar) {
            console.debug('Calendar found', calendar);

            const eventListResult = await calendarClient.events.list({
                calendarId: calendar.id
            });

            console.debug('Calendar events retrieved', eventListResult);

            events.push(...eventListResult.data.items);
        } else {
            const calendarInsertResult = await calendarClient.calendars.insert({
                requestBody: {
                    summary: calendarName,
                    description: 'Created by TaskUnifier'
                }
            });

            console.debug('Calendar created', calendarInsertResult);

            calendar = calendarInsertResult.data;
        }

        for (let task of tasks) {
            if (!publishCompletedTaskEvents && task.completed) {
                continue;
            }

            const length = task.length && task.length > 30 ? task.length : 30;

            if (publishStartDateEvents && task.startDate) {
                const diff = moment(task.startDate).diff(moment(), 'day');

                if (diff < -publishMaxDaysInPast || diff > publishMaxDaysInFuture) {
                    continue;
                }

                await publishEvent(
                    calendarClient,
                    events,
                    calendar,
                    task,
                    task.startDate,
                    moment(task.startDate).add(length, 'second'),
                    '10',
                    showStartTime,
                    locations);
            }

            if (publishDueDateEvents && task.dueDate) {
                const diff = moment(task.dueDate).diff(moment(), 'day');

                if (diff < -publishMaxDaysInPast || diff > publishMaxDaysInFuture) {
                    continue;
                }

                await publishEvent(
                    calendarClient,
                    events,
                    calendar,
                    task,
                    moment(task.dueDate).subtract(length, 'second'),
                    task.dueDate,
                    '9',
                    showDueTime,
                    locations);
            }

            if (publishWorkLogEvents && task.workLogs) {
                for (let workLog of task.workLogs) {
                    if (workLog.start && workLog.end) {
                        const diff1 = moment(workLog.start).diff(moment(), 'day');
                        const diff2 = moment(workLog.end).diff(moment(), 'day');

                        if ((diff1 < -publishMaxDaysInPast || diff1 > publishMaxDaysInFuture) && (diff2 < -publishMaxDaysInPast || diff2 > publishMaxDaysInFuture)) {
                            continue;
                        }

                        await publishEvent(
                            calendarClient,
                            events,
                            calendar,
                            task,
                            workLog.start,
                            workLog.end,
                            '6',
                            true,
                            locations);
                    }
                }
            }
        }

        for (let event of events) {
            const eventDeleteResult = await calendarClient.events.delete({
                calendarId: calendar.id,
                eventId: event.id
            });

            console.debug('Event deleted', eventDeleteResult);
        }
    };
}

function createEvent(task, startDate, endDate, colorId, useTime, locations) {
    const location = locations.find(location => location.id === task.location);

    const event = {
        summary: task.title,
        colorId,
        transparency: 'transparent',
        location: location ? location.title : undefined
    };

    if (useTime) {
        event.start = {
            date: undefined,
            dateTime: moment(startDate).utc().format('YYYY-MM-DDTHH:mm:ss[Z]')
        };

        event.end = {
            date: undefined,
            dateTime: moment(endDate).utc().format('YYYY-MM-DDTHH:mm:ss[Z]')
        };
    } else {
        event.start = {
            date: moment(startDate).utc().format('YYYY-MM-DD'),
            dateTime: undefined
        };

        event.end = {
            date: moment(endDate).utc().format('YYYY-MM-DD'),
            dateTime: undefined
        };
    }

    return event;
}

async function publishEvent(calendarClient, events, calendar, task, startDate, endDate, colorId, useTime, locations) {
    const newEvent = createEvent(task, startDate, endDate, colorId, useTime, locations);

    let event = events.find(event => {
        const eventSubset = {
            summary: event.summary,
            colorId: event.colorId,
            transparency: event.transparency,
            location: event.location,
            start: event.start ? {
                date: event.start.date,
                dateTime: event.start.dateTime ? moment(event.start.dateTime).utc().format('YYYY-MM-DDTHH:mm:ss[Z]') : event.start.dateTime
            } : event.start,
            end: event.end ? {
                date: event.end.date,
                dateTime: event.end.dateTime ? moment(event.end.dateTime).utc().format('YYYY-MM-DDTHH:mm:ss[Z]') : event.end.dateTime
            } : event.end
        };

        return equals(eventSubset, newEvent);
    });

    if (event) {
        events.splice(events.indexOf(event), 1);
        return;
    }

    const eventInsertResult = await calendarClient.events.insert({
        calendarId: calendar.id,
        requestBody: newEvent
    });

    console.debug('Event created', eventInsertResult);
}