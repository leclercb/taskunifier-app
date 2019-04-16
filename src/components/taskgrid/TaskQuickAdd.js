import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import withTasks from '../../containers/WithTasks';

function TaskQuickAdd(props) {
    const [value, setValue] = useState(null);

    const onAdd = () => {
        props.addTask({
            title: value
        });

        setValue(null);
    };

    return (
        <Input
            value={value}
            placeholder="Quick add task..."
            onChange={e => setValue(e.target.value)}
            onPressEnter={() => onAdd()} />
    );
}

TaskQuickAdd.propTypes = {
    addTask: PropTypes.func.isRequired
}

export default withTasks(TaskQuickAdd, { actionsOnly: true });