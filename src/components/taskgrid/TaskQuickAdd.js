import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import withTasks from '../../containers/WithTasks';
import withData from '../../containers/WithData';
import Icon from '../common/Icon';
import { ContextTitle } from '../contexts/ContextTitle';
import { FolderTitle } from '../folders/FolderTitle';
import { GoalTitle } from '../goals/GoalTitle';
import { LocationTitle } from '../locations/LocationTitle';

function TaskQuickAdd(props) {
    const [values, setValues] = useState([]);
    const [open, setOpen] = useState(false);
    const selectRef = useRef(null);

    const onChange = values => {
        if (values.includes('__ADD__')) {
            onAdd(values.filter(v => v !== '__ADD__'))
        } else {
            setValues(values);
        }
    }

    const onKeyInputDown = () => {
        setOpen(true);
    }

    const onBlur = () => {
        setOpen(false);
    }

    const onAdd = values => {
        const tags = {};

        values.forEach((value, index) => {
            if (index === 0) {
                return;
            }

            const object = JSON.parse(value.substr(value.lastIndexOf('__') + 2));
            tags[object.field] = object.value;
        });

        props.addTask({
            title: values[0],
            ...tags
        });

        setValues([]);
        setTimeout(() => setOpen(false));
    };

    return (
        <Select
            ref={selectRef}
            mode={values.length > 0 ? 'multiple' : 'tags'}
            value={values}
            placeholder="Quick add task..."
            onChange={onChange}
            onInputKeyDown={onKeyInputDown}
            onBlur={onBlur}
            open={open}
            style={{ width: "100%" }}>
            {values.length > 0 ? [
                <Select.Option key='add' value="__ADD__">
                    <Icon icon="plus" text="Create task" />
                </Select.Option>,
                <Select.OptGroup key='contexts' label="Contexts">
                    {props.contexts.map(context => (
                        <Select.Option key={context.id} value={context.title + '__' + JSON.stringify({ field: 'context', value: context.id })}>
                            <ContextTitle context={context} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>,
                <Select.OptGroup key='folders' label="Folders">
                    {props.folders.map(folder => (
                        <Select.Option key={folder.id} value={folder.title + '__' + JSON.stringify({ field: 'folder', value: folder.id })}>
                            <FolderTitle folder={folder} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>,
                <Select.OptGroup key='goals' label="Goals">
                    {props.goals.map(goal => (
                        <Select.Option key={goal.id} value={goal.title + '__' + JSON.stringify({ field: 'goal', value: goal.id })}>
                            <GoalTitle goal={goal} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>,
                <Select.OptGroup key='locations' label="Locations">
                    {props.locations.map(location => (
                        <Select.Option key={location.id} value={location.title + '__' + JSON.stringify({ field: 'location', value: location.id })}>
                            <LocationTitle location={location} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>
            ] : null}
        </Select>
    );
}

TaskQuickAdd.propTypes = {
    addTask: PropTypes.func.isRequired
}

export default withTasks(withData(TaskQuickAdd, {
    includeContexts: true,
    includeFolders: true,
    includeGoals: true,
    includeLocations: true
}), { actionsOnly: true });