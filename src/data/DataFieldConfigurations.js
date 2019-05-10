/* eslint react/display-name: 0 */

import React from 'react';
import moment from 'moment';
import { Checkbox, DatePicker, Input, InputNumber, Progress, Select, Tag } from 'antd';
import { getFieldConditions } from 'data/DataFieldConditions';
import ColorPicker from 'components/common/ColorPicker';
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
import NoteTitle from 'components/notes/common/NoteTitle';
import NoteSelect from 'components/notes/common/NoteSelect';
import PriorityTitle from 'components/priorities/PriorityTitle';
import PrioritySelect from 'components/priorities/PrioritySelect';
import RepeatField from 'components/repeat/RepeatField';
import StatusTitle from 'components/statuses/StatusTitle';
import StatusSelect from 'components/statuses/StatusSelect';
import TagsTitle from 'components/tags/TagsTitle';
import TagsSelect from 'components/tags/TagsSelect';
import TaskTitle from 'components/tasks/common/TaskTitle';
import TaskSelect from 'components/tasks/common/TaskSelect';
import TaskTemplateSelect from 'components/tasktemplates/TaskTemplateSelect';
import TimerField from 'components/common/TimerField';
import { TaskTemplateTitle } from 'components/tasktemplates/TaskTemplateTitle';
import { getContacts } from 'selectors/ContactSelectors';
import { getContexts } from 'selectors/ContextSelectors';
import { getFolders } from 'selectors/FolderSelectors';
import { getGoals } from 'selectors/GoalSelectors';
import { getLocations } from 'selectors/LocationSelectors';
import { getNotes } from 'selectors/NoteSelectors';
import { getTasks } from 'selectors/TaskSelectors';
import { getTaskTemplates } from 'selectors/TaskTemplateSelectors';
import {
    compareBooleans,
    compareContacts,
    compareDates,
    compareNumbers,
    compareObjects,
    comparePriorities,
    compareRepeats,
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
    toStringStatus,
    toStringTimer
} from 'utils/StringUtils';

function defaultGetValueFromEvent(e) {
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
        'number',
        'priority',
        'progress',
        'repeat',
        'select',
        'selectTags',
        'star',
        'status',
        'tags',
        'task',
        'taskTemplate',
        'text',
        'textarea',
        'timer'
    ];
}

export function getFieldConfiguration(type, options) {
    let configuration = null;

    switch (type) {
        case 'boolean': {
            configuration = {
                title: 'Boolean',
                width: 100,
                alwaysInEdition: true,
                commitOnChange: true,
                normalize: value => value,
                valuePropName: 'checked',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b) => compareBooleans(a, b),
                toString: value => toStringBoolean(value),
                render: value => <Checkbox checked={!!value} />,
                input: props => (
                    <Checkbox {...props} data-prevent-default={true} />
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
                normalize: value => value,
                valuePropName: 'color',
                getValueFromEvent: event => event.color,
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                render: value => <ColorPicker color={value} />,
                input: props => (
                    <ColorPicker {...props} />
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b, state) => compareContacts(a, b, getContacts(state)),
                toString: (value, state) => toStringContact(value, getContacts(state)),
                render: value => (
                    <ContactTitle contactId={value} />
                ),
                input: props => (
                    <ContactSelect {...props} />
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b, state) => compareObjects(a, b, getContexts(state)),
                toString: (value, state) => toStringObject(value, getContexts(state)),
                render: value => (
                    <ContextTitle contextId={value} />
                ),
                input: props => (
                    <ContextSelect {...props} />
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
                commitOnChange: true,
                normalize: value => {
                    if (Number.isInteger(value)) {
                        return value;
                    }

                    return value ? moment(value) : null;
                },
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b) => compareDates(a, b, false),
                toString: value => toStringDate(value, dateFormat),
                render: value => {
                    if (extended && Number.isInteger(value)) {
                        return value;
                    }

                    return value ? moment(value).format(dateFormat) : (<span>&nbsp;</span>);
                },
                input: props => extended ?
                    <ExtendedDatePicker format={dateFormat} {...props} /> :
                    <DatePicker format={dateFormat} {...props} />,
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
                commitOnChange: true,
                normalize: value => {
                    if (Number.isInteger(value)) {
                        return value;
                    }

                    return value ? moment(value) : null;
                },
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b) => compareDates(a, b, true),
                toString: value => toStringDate(value, `${dateFormat} ${timeFormat}`),
                render: value => {
                    if (extended && Number.isInteger(value)) {
                        return value;
                    }

                    return value ? moment(value).format(`${dateFormat} ${timeFormat}`) : (<span>&nbsp;</span>);
                },
                input: props => extended ?
                    <ExtendedDatePicker showTime={{ format: timeFormat }} format={`${dateFormat} ${timeFormat}`} {...props} /> :
                    <DatePicker showTime={{ format: timeFormat }} format={`${dateFormat} ${timeFormat}`} {...props} />,
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b, state) => compareObjects(a, b, getFolders(state)),
                toString: (value, state) => toStringObject(value, getFolders(state)),
                render: value => (
                    <FolderTitle folderId={value} />
                ),
                input: props => (
                    <FolderSelect {...props} />
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b, state) => compareObjects(a, b, getGoals(state)),
                toString: (value, state) => toStringObject(value, getGoals(state)),
                render: value => (
                    <GoalTitle goalId={value} />
                ),
                input: props => (
                    <GoalSelect {...props} />
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value),
                render: value => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <InputNumber min={0} max={12} {...props} style={{ width: 60 }} />
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
                normalize: value => value,
                valuePropName: 'length',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringLength(value),
                render: value => (
                    <LengthField length={value} readOnly={true} />
                ),
                input: props => (
                    <LengthField {...props} />
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: () => 0,
                toString: value => toStringArray(value),
                render: value => (
                    <LinkedContactLinksTitle linkIds={value} />
                ),
                input: props => (
                    <LinkedContactLinksSelect {...props} />
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: () => 0,
                toString: value => toStringArray(value),
                render: value => (
                    <LinkedFileLinksTitle linkIds={value} />
                ),
                input: props => (
                    <LinkedFileLinksSelect {...props} />
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: () => 0,
                toString: value => toStringArray(value),
                render: value => (
                    <LinkedTaskLinksTitle linkIds={value} />
                ),
                input: props => (
                    <LinkedTaskLinksSelect {...props} />
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b, state) => compareObjects(a, b, getLocations(state)),
                toString: (value, state) => toStringObject(value, getLocations(state)),
                render: value => (
                    <LocationTitle locationId={value} />
                ),
                input: props => (
                    <LocationSelect {...props} />
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value, '', currency),
                render: value => value ? currency + ' ' + value : <span>&nbsp;</span>,
                input: props => (
                    <InputNumber
                        formatter={value => `${currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace('/(' + escape(currency) + ')\\s?|(,*)/g', '')}
                        {...props} />
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b, state) => compareObjects(a, b, getNotes(state)),
                toString: (value, state) => toStringObject(value, getNotes(state)),
                render: value => (
                    <NoteTitle noteId={value} />
                ),
                input: props => (
                    <NoteSelect {...props} />
                ),
                conditionsFieldType: 'note',
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value),
                render: value => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <InputNumber min={min} max={max} {...props} />
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b) => comparePriorities(a, b),
                toString: value => toStringPriority(value),
                render: value => (
                    <PriorityTitle priorityId={value} />
                ),
                input: props => (
                    <PrioritySelect {...props} />
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value, '%'),
                render: value => Number.isInteger(value) ? <Progress percent={value} size="small" /> : <span>&nbsp;</span>,
                input: props => (
                    <InputNumber min={0} max={100} {...props} />
                ),
                conditionsFieldType: 'progress',
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
                normalize: value => value,
                valuePropName: 'repeat',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b) => compareRepeats(a, b),
                toString: value => formatRepeat(value),
                render: value => {
                    const result = formatRepeat(value);
                    return result ? result : <span>&nbsp;</span>;
                },
                input: props => (
                    <RepeatField {...props} />
                ),
                conditionsFieldType: 'repeat',
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                render: value => (
                    value ? value : <span>&nbsp;</span>
                ),
                input: props => (
                    <Select {...props}>
                        {values.map(value => {
                            value = typeof value === 'object' ? value : {
                                title: value,
                                value: value
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: () => 0,
                toString: value => toStringArray(value),
                render: values => (
                    values ? values.map(value => (<Tag key={value}>{value}</Tag>)) : <span>&nbsp;</span>
                ),
                input: props => (
                    <Select mode="tags" {...props} />
                ),
                conditionsFieldType: 'selectTags',
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
                normalize: value => value,
                valuePropName: 'checked',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b) => compareBooleans(a, b),
                toString: value => toStringBoolean(value),
                render: value => <StarCheckbox checked={!!value} />,
                input: props => (
                    <StarCheckbox {...props} />
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b) => compareStatuses(a, b),
                toString: value => toStringStatus(value),
                render: value => (
                    <StatusTitle statusId={value} />
                ),
                input: props => (
                    <StatusSelect {...props} />
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: () => 0,
                toString: value => toStringArray(value),
                render: value => (
                    <TagsTitle tagIds={value} />
                ),
                input: props => (
                    <TagsSelect {...props} />
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b, state) => compareObjects(a, b, getTasks(state)),
                toString: (value, state) => toStringObject(value, getTasks(state)),
                render: value => (
                    <TaskTitle taskId={value} />
                ),
                input: props => (
                    <TaskSelect {...props} />
                ),
                conditionsFieldType: 'task',
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b, state) => compareObjects(a, b, getTaskTemplates(state)),
                toString: (value, state) => toStringObject(value, getTaskTemplates(state)),
                render: value => (
                    <TaskTemplateTitle taskTemplateId={value} />
                ),
                input: props => (
                    <TaskTemplateSelect {...props} />
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b) => compareStrings(a, b),
                toString:value => toString(value),
                render: value => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <Input.TextArea autosize={true} {...props} onPressEnter={null} />
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
                normalize: value => value,
                valuePropName: 'timer',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: () => 0,
                toString:value => toStringTimer(value),
                render: (value, props) => (
                    <TimerField
                        timer={value}
                        readOnly={true}
                        onChange={props ? props.onChange : null} />
                ),
                input: props => (
                    <TimerField {...props} />
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
                normalize: value => value,
                valuePropName: 'value',
                getValueFromEvent: defaultGetValueFromEvent,
                compare: (a, b) => compareStrings(a, b),
                toString:value => toString(value),
                render: value => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <Input {...props} />
                ),
                conditionsFieldType: 'text',
                options: []
            };

            break;
        }
    }

    configuration.select = () => (
        <Select placeholder="Condition">
            {getFieldConditions(type).map(condition => (
                <Select.Option key={condition.type} value={condition.type}>
                    {condition.title}
                </Select.Option>
            ))}
        </Select>
    );

    return configuration;
}