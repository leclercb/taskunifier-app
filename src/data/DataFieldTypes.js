/* eslint react/display-name: 0 */

import React from 'react';
import moment from 'moment';
import { Checkbox, Input, InputNumber, Progress, Select, Tag } from 'antd';
import { getFieldConditions } from 'data/DataFieldConditions';
import ColorPicker from 'components/common/ColorPicker';
import DatePicker from 'components/common/DatePicker';
import ExtendedDatePicker from 'components/common/ExtendedDatePicker';
import StarCheckbox from 'components/common/StarCheckbox';
import ContactTitle from 'components/contacts/ContactTitle';
import ContactSelect from 'components/contacts/ContactSelect';
import ContextTitle from 'components/contexts/ContextTitle';
import ContextSelect from 'components/contexts/ContextSelect';
import FolderTitle from 'components/folders/FolderTitle';
import FolderSelect from 'components/folders/FolderSelect';
import GoalTitle from 'components/goals/GoalTitle';
import GoalSelect from 'components/goals/GoalSelect';
import LengthField from 'components/common/LengthField';
import {
    LinkedContactLinksSelect,
    LinkedFileLinksSelect,
    LinkedTaskLinksSelect
} from 'components/links/LinksSelect';
import {
    LinkedContactLinksTitle,
    LinkedFileLinksTitle,
    LinkedTaskLinksTitle
} from 'components/links/LinksTitle';
import LocationTitle from 'components/locations/LocationTitle';
import LocationSelect from 'components/locations/LocationSelect';
import NoteFieldTitle from 'components/notefields/NoteFieldTitle';
import NoteFieldSelect from 'components/notefields/NoteFieldSelect';
import NoteTitle from 'components/notes/common/NoteTitle';
import NoteSelect from 'components/notes/common/NoteSelect';
import ReminderField from 'components/common/ReminderField';
import RepeatFromField from 'components/common/RepeatFromField';
import PriorityTitle from 'components/priorities/PriorityTitle';
import PrioritySelect from 'components/priorities/PrioritySelect';
import RepeatField from 'components/repeat/RepeatField';
import SortDirectionTitle from 'components/sorters/SortDirectionTitle';
import SortDirectionSelect from 'components/sorters/SortDirectionSelect';
import StatusTitle from 'components/statuses/StatusTitle';
import StatusSelect from 'components/statuses/StatusSelect';
import TagsTitle from 'components/tags/TagsTitle';
import TagsSelect from 'components/tags/TagsSelect';
import TaskTitle from 'components/tasks/common/TaskTitle';
import TaskSelect from 'components/tasks/common/TaskSelect';
import TaskFieldTitle from 'components/taskfields/TaskFieldTitle';
import TaskFieldSelect from 'components/taskfields/TaskFieldSelect';
import TaskTemplateSelect from 'components/tasktemplates/TaskTemplateSelect';
import TimerField from 'components/common/TimerField';
import { TaskTemplateTitle } from 'components/tasktemplates/TaskTemplateTitle';
import { getContactsFilteredByVisibleState } from 'selectors/ContactSelectors';
import { getContextsFilteredByVisibleState } from 'selectors/ContextSelectors';
import { getFoldersFilteredByVisibleState } from 'selectors/FolderSelectors';
import { getGoalsFilteredByVisibleState } from 'selectors/GoalSelectors';
import { getLocationsFilteredByVisibleState } from 'selectors/LocationSelectors';
import { getNotesFilteredByVisibleState } from 'selectors/NoteSelectors';
import { getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';
import { getTaskTemplatesFilteredByVisibleState } from 'selectors/TaskTemplateSelectors';
import {
    compareBooleans,
    compareContacts,
    compareDates,
    compareNumbers,
    compareObjects,
    comparePriorities,
    compareRepeats,
    compareSortDirections,
    compareStatuses,
    compareStrings
} from 'utils/CompareUtils';
import { escape } from 'utils/RegexUtils';
import { formatRepeat } from 'utils/RepeatUtils';
import {
    toString,
    toStringArray,
    toStringBoolean,
    toStringContact,
    toStringDate,
    toStringLength,
    toStringNumber,
    toStringObject,
    toStringPriority,
    toStringReminder,
    toStringRepeatFrom,
    toStringSortDirection,
    toStringStatus,
    toStringTimer
} from 'utils/StringUtils';
import { getNoteFieldsIncludingDefaults } from 'selectors/NoteFieldSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';

export function getDefaultGetValueFromEvent(e) {
    if (!e || !e.target) {
        return e;
    }
    const { target } = e;
    return target.type === 'checkbox' ? target.checked : target.value;
}

export function getFieldTypes() {
    return [
        'boolean',
        'color',
        'contact',
        'context',
        'date',
        'dateTime',
        'folder',
        'goal',
        'importance',
        'length',
        'linkedContactLinks',
        'linkedFileLinks',
        'linkedTaskLinks',
        'location',
        'money',
        'note',
        'noteField',
        'number',
        'priority',
        'progress',
        'reminder',
        'repeat',
        'repeatFrom',
        'select',
        'selectTags',
        'sortDirection',
        'star',
        'status',
        'tags',
        'task',
        'taskField',
        'taskTemplate',
        'text',
        'textarea',
        'timer'
    ];
}

export function getFieldType(type, options) {
    let configuration = null;

    const removeExtraProps = props => {
        const { ...wrappedProps } = props;
        delete wrappedProps.fieldMode;
        delete wrappedProps.onCommit;
        return wrappedProps;
    }

    switch (type) {
        case 'boolean': {
            configuration = {
                title: 'Boolean',
                width: 100,
                alwaysInEdition: true,
                commitOnChange: true,
                valuePropName: 'checked',
                compare: (a, b) => compareBooleans(a, b),
                toString: value => toStringBoolean(value),
                render: value => <Checkbox checked={!!value} />,
                input: props => (
                    <Checkbox
                        data-prevent-default={true}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'boolean',
                options: []
            };

            break;
        }
        case 'color': {
            configuration = {
                title: 'Color',
                width: 100,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'color',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                render: value => <ColorPicker color={value} />,
                input: props => (
                    <ColorPicker
                        onBlur={props.onCommit}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'color',
                options: []
            };

            break;
        }
        case 'contact': {
            configuration = {
                title: 'Contact',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareContacts(a, b, getContactsFilteredByVisibleState(state)),
                toString: (value, state) => toStringContact(value, getContactsFilteredByVisibleState(state)),
                render: value => (
                    <ContactTitle contactId={value} />
                ),
                input: props => (
                    <ContactSelect
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'contact',
                options: []
            };

            break;
        }
        case 'context': {
            configuration = {
                title: 'Context',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getContextsFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getContextsFilteredByVisibleState(state)),
                render: value => (
                    <ContextTitle contextId={value} />
                ),
                input: props => (
                    <ContextSelect
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'context',
                options: []
            };

            break;
        }
        case 'date': {
            const extended = options && options.extended === true;
            const dateFormat = options && options.dateFormat ? options.dateFormat : 'DD/MM/YYYY';

            configuration = {
                title: 'Date',
                width: 250,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b) => compareDates(a, b, false),
                toString: value => toStringDate(value, dateFormat),
                render: value => {
                    if (extended && Number.isInteger(value)) {
                        return value;
                    }

                    return value ? moment(value).format(dateFormat) : (<span>&nbsp;</span>);
                },
                input: props => {
                    if (extended) {
                        return (
                            <ExtendedDatePicker
                                onOpenChange={status => {
                                    if (props.onCommit && !status) {
                                        props.onCommit();
                                    }
                                }}
                                format={dateFormat}
                                {...removeExtraProps(props)} />
                        );
                    }

                    return (
                        <DatePicker
                            onOpenChange={status => {
                                if (props.onCommit && !status) {
                                    props.onCommit();
                                }
                            }}
                            format={dateFormat}
                            {...removeExtraProps(props)} />
                    );
                },
                conditionsFieldType: 'date',
                options: [
                    {
                        id: 'dateFormat',
                        title: 'Date format',
                        type: 'text'
                    }
                ]
            };

            break;
        }
        case 'dateTime': {
            const extended = options && options.extended === true;
            const dateFormat = options && options.dateFormat ? options.dateFormat : 'DD/MM/YYYY';
            const timeFormat = options && options.timeFormat ? options.timeFormat : 'HH:mm';

            configuration = {
                title: 'Date time',
                width: 250,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b) => compareDates(a, b, true),
                toString: value => toStringDate(value, `${dateFormat} ${timeFormat}`),
                render: value => {
                    if (extended && Number.isInteger(value)) {
                        return value;
                    }

                    return value ? moment(value).format(`${dateFormat} ${timeFormat}`) : (<span>&nbsp;</span>);
                },
                input: props => {
                    if (extended) {
                        return (
                            <ExtendedDatePicker
                                onOpenChange={status => {
                                    if (props.onCommit && !status) {
                                        props.onCommit();
                                    }
                                }}
                                showTime={{ format: timeFormat }}
                                format={`${dateFormat} ${timeFormat}`}
                                {...removeExtraProps(props)} />
                        );
                    }

                    return (
                        <DatePicker
                            onOpenChange={status => {
                                if (props.onCommit && !status) {
                                    props.onCommit();
                                }
                            }}
                            showTime={{ format: timeFormat }}
                            format={`${dateFormat} ${timeFormat}`}
                            {...removeExtraProps(props)} />
                    );
                },
                conditionsFieldType: 'dateTime',
                options: [
                    {
                        id: 'dateFormat',
                        title: 'Date format',
                        type: 'text'
                    },
                    {
                        id: 'timeFormat',
                        title: 'Time format',
                        type: 'text'
                    }
                ]
            };

            break;
        }
        case 'folder': {
            configuration = {
                title: 'Folder',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getFoldersFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getFoldersFilteredByVisibleState(state)),
                render: value => (
                    <FolderTitle folderId={value} />
                ),
                input: props => (
                    <FolderSelect
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'folder',
                options: []
            };

            break;
        }
        case 'goal': {
            configuration = {
                title: 'Goal',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getGoalsFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getGoalsFilteredByVisibleState(state)),
                render: value => (
                    <GoalTitle goalId={value} />
                ),
                input: props => (
                    <GoalSelect
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'goal',
                options: []
            };

            break;
        }
        case 'importance': {
            configuration = {
                title: 'Importance',
                width: 150,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value),
                render: value => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <InputNumber
                        onBlur={props.onCommit}
                        min={0}
                        max={12}
                        style={{ width: 60 }}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'importance',
                options: []
            };

            break;
        }
        case 'length': {
            configuration = {
                title: 'Length',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'length',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringLength(value),
                render: value => (
                    <LengthField length={value} readOnly={true} />
                ),
                input: props => (
                    <LengthField
                        onBlur={props.onCommit}
                        onPressEnter={props.onCommit}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'length',
                options: []
            };

            break;
        }
        case 'linkedContactLinks': {
            configuration = {
                title: 'Linked Contact Links',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: () => 0,
                toString: value => toStringArray(value),
                render: value => (
                    <LinkedContactLinksTitle linkIds={value} />
                ),
                input: props => (
                    <LinkedContactLinksSelect
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'linkedContactLinks',
                options: []
            };

            break;
        }
        case 'linkedFileLinks': {
            configuration = {
                title: 'Linked File Links',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: () => 0,
                toString: value => toStringArray(value),
                render: value => (
                    <LinkedFileLinksTitle linkIds={value} />
                ),
                input: props => (
                    <LinkedFileLinksSelect
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'linkedFileLinks',
                options: []
            };

            break;
        }
        case 'linkedTaskLinks': {
            configuration = {
                title: 'Linked Task Links',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: () => 0,
                toString: value => toStringArray(value),
                render: value => (
                    <LinkedTaskLinksTitle linkIds={value} />
                ),
                input: props => (
                    <LinkedTaskLinksSelect
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'linkedTaskLinks',
                options: []
            };

            break;
        }
        case 'location': {
            configuration = {
                title: 'Location',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getLocationsFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getLocationsFilteredByVisibleState(state)),
                render: value => (
                    <LocationTitle locationId={value} />
                ),
                input: props => (
                    <LocationSelect
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'location',
                options: []
            };

            break;
        }
        case 'money': {
            const currency = options && options.currency ? options.currency : '€';

            configuration = {
                title: 'Money Dollar',
                width: 150,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value, '', currency),
                render: value => value ? currency + ' ' + value : <span>&nbsp;</span>,
                input: props => (
                    <InputNumber
                        onBlur={props.onCommit}
                        formatter={value => `${currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace('/(' + escape(currency) + ')\\s?|(,*)/g', '')}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'money',
                options: [
                    {
                        id: 'currency',
                        title: 'Currency',
                        type: 'text'
                    }
                ]
            };

            break;
        }
        case 'note': {
            configuration = {
                title: 'Note',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getNotesFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getNotesFilteredByVisibleState(state)),
                render: value => (
                    <NoteTitle noteId={value} />
                ),
                input: props => (
                    <NoteSelect
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'note',
                options: []
            };

            break;
        }
        case 'noteField': {
            configuration = {
                title: 'Note Field',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getNoteFieldsIncludingDefaults(state)),
                toString: (value, state) => toStringObject(value, getNoteFieldsIncludingDefaults(state)),
                render: value => (
                    <NoteFieldTitle noteFieldId={value} />
                ),
                input: props => (
                    <NoteFieldSelect
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'noteField',
                options: []
            };

            break;
        }
        case 'number': {
            const min = options && options.min ? options.min : -Infinity;
            const max = options && options.max ? options.max : Infinity;

            configuration = {
                title: 'Number',
                width: 150,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value),
                render: value => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <InputNumber
                        onBlur={props.onCommit}
                        min={min}
                        max={max}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'number',
                options: [
                    {
                        id: 'min',
                        title: 'Minimum',
                        type: 'number'
                    },
                    {
                        id: 'max',
                        title: 'Maximum',
                        type: 'number'
                    }
                ]
            };

            break;
        }
        case 'priority': {
            configuration = {
                title: 'Priority',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b) => comparePriorities(a, b),
                toString: value => toStringPriority(value),
                render: value => (
                    <PriorityTitle priorityId={value} />
                ),
                input: props => (
                    <PrioritySelect
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'priority',
                options: []
            };

            break;
        }
        case 'progress': {
            configuration = {
                title: 'Progress',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value, '', '%'),
                render: value => Number.isInteger(value) ? <Progress percent={value} size="small" /> : <span>&nbsp;</span>,
                input: props => (
                    <InputNumber
                        onBlur={props.onCommit}
                        min={0}
                        max={100}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'progress',
                options: []
            };

            break;
        }
        case 'reminder': {
            configuration = {
                title: 'Reminder',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringReminder(value),
                render: value => (
                    Number.isInteger(value) ? toStringReminder(value) : <span>&nbsp;</span>
                ),
                input: props => (
                    <ReminderField
                        onBlur={props.onCommit}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'reminder',
                options: []
            };

            break;
        }
        case 'repeat': {
            configuration = {
                title: 'Repeat',
                width: 250,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'repeat',
                compare: (a, b) => compareRepeats(a, b),
                toString: value => formatRepeat(value),
                render: value => {
                    const result = formatRepeat(value);
                    return result ? result : <span>&nbsp;</span>;
                },
                input: props => (
                    <RepeatField
                        defaultOpened={props.fieldMode === 'table'}
                        onOpenChange={status => {
                            if (props.onCommit && !status) {
                                props.onCommit();
                            }
                        }}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'repeat',
                options: []
            };

            break;
        }
        case 'repeatFrom': {
            configuration = {
                title: 'Repeat From',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toStringRepeatFrom(value),
                render: value => toStringRepeatFrom(value),
                input: props => (
                    <RepeatFromField
                        onBlur={props.onCommit}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'repeatFrom',
                options: []
            };

            break;
        }
        case 'select': {
            let values = options && options.values ? options.values : [];
            values = Array.isArray(values) ? values : [values];

            configuration = {
                title: 'Select',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                render: value => (
                    value ? value : <span>&nbsp;</span>
                ),
                input: props => (
                    <Select
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)}>
                        {values.map(value => {
                            value = typeof value === 'object' ? value : {
                                title: value,
                                value
                            };

                            return (
                                <Select.Option key={value.value} value={value.value}>
                                    {value.title}
                                </Select.Option>
                            );
                        })}
                    </Select>
                ),
                conditionsFieldType: 'select',
                options: [
                    {
                        id: 'values',
                        title: 'Values',
                        type: 'selectTags'
                    }
                ]
            };

            break;
        }
        case 'selectTags': {
            configuration = {
                title: 'Select Tags',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: () => 0,
                toString: value => toStringArray(value),
                render: values => (
                    values ? values.map(value => (<Tag key={value}>{value}</Tag>)) : <span>&nbsp;</span>
                ),
                input: props => (
                    <Select
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        mode="tags"
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'selectTags',
                options: []
            };

            break;
        }
        case 'sortDirection': {
            configuration = {
                title: 'Sort Direction',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b) => compareSortDirections(a, b),
                toString: value => toStringSortDirection(value),
                render: value => (
                    <SortDirectionTitle sortDirectionId={value} />
                ),
                input: props => (
                    <SortDirectionSelect
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'sortDirection',
                options: []
            };

            break;
        }
        case 'star': {
            configuration = {
                title: 'Star',
                width: 100,
                alwaysInEdition: true,
                commitOnChange: true,
                valuePropName: 'checked',
                compare: (a, b) => compareBooleans(a, b),
                toString: value => toStringBoolean(value),
                render: value => <StarCheckbox checked={!!value} />,
                input: props => (
                    <StarCheckbox {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'star',
                options: []
            };

            break;
        }
        case 'status': {
            configuration = {
                title: 'Status',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b) => compareStatuses(a, b),
                toString: value => toStringStatus(value),
                render: value => (
                    <StatusTitle statusId={value} />
                ),
                input: props => (
                    <StatusSelect
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'status',
                options: []
            };

            break;
        }
        case 'tags': {
            configuration = {
                title: 'Tags',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: () => 0,
                toString: value => toStringArray(value),
                render: value => (
                    <TagsTitle tagIds={value} />
                ),
                input: props => (
                    <TagsSelect
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'tags',
                options: []
            };

            break;
        }
        case 'task': {
            configuration = {
                title: 'Task',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getTasksFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getTasksFilteredByVisibleState(state)),
                render: value => (
                    <TaskTitle taskId={value} />
                ),
                input: props => (
                    <TaskSelect
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'task',
                options: []
            };

            break;
        }
        case 'taskField': {
            configuration = {
                title: 'Task Field',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getTaskFieldsIncludingDefaults(state)),
                toString: (value, state) => toStringObject(value, getTaskFieldsIncludingDefaults(state)),
                render: value => (
                    <TaskFieldTitle taskFieldId={value} />
                ),
                input: props => (
                    <TaskFieldSelect
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'taskField',
                options: []
            };

            break;
        }
        case 'taskTemplate': {
            configuration = {
                title: 'Task Template',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getTaskTemplatesFilteredByVisibleState(state)),
                toString: (value, state) => toStringObject(value, getTaskTemplatesFilteredByVisibleState(state)),
                render: value => (
                    <TaskTemplateTitle taskTemplateId={value} />
                ),
                input: props => (
                    <TaskTemplateSelect
                        onBlur={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'taskTemplate',
                options: []
            };

            break;
        }
        case 'textarea': {
            configuration = {
                title: 'Text Area',
                width: 250,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                render: value => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <Input.TextArea
                        onBlur={props.onCommit}
                        autosize={true}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'textarea',
                options: []
            };

            break;
        }
        case 'timer': {
            configuration = {
                title: 'Timer',
                width: 200,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'timer',
                compare: () => 0,
                toString: value => toStringTimer(value),
                render: (value, props) => {
                    /* eslint-disable react/prop-types */
                    return (
                        <TimerField
                            timer={value}
                            readOnly={true}
                            onChange={props ? props.onChange : null} />
                    );
                    /* eslint-enable react/prop-types */
                },
                input: props => (
                    <TimerField
                        onBlur={props.onCommit}
                        onPressEnter={props.onCommit}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'boolean',
                options: []
            };

            break;
        }
        case 'text':
        default: {
            configuration = {
                title: 'Text',
                width: 250,
                alwaysInEdition: false,
                commitOnChange: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                render: value => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <Input
                        onBlur={props.onCommit}
                        onPressEnter={props.onCommit}
                        {...removeExtraProps(props)} />
                ),
                conditionsFieldType: 'text',
                options: []
            };

            break;
        }
    }

    configuration.select = () => (
        <Select dropdownMatchSelectWidth={false} placeholder="Condition">
            {getFieldConditions(type).map(condition => (
                <Select.Option key={condition.type} value={condition.type}>
                    {condition.title}
                </Select.Option>
            ))}
        </Select>
    );

    return configuration;
}