import React from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import ReactDataGrid from 'react-data-grid';
import withApp from '../../containers/WithApp';
import withFields from '../../containers/WithFields';
import withTasks from '../../containers/WithTasks';
import { getFieldConfiguration } from '../../data/DataFieldConfigurations';
import { getWidthForType } from '../../utils/FieldUtils';
import { FieldPropType } from '../../proptypes/FieldPropTypes';
import { TaskPropType } from '../../proptypes/TaskPropTypes';
import './EditableCell.css';

export function createFormatter(field) {
    function RGDFormatter(props) {
        return getFieldConfiguration(field.type).render(props.value);
    }

    return RGDFormatter;
}

export function createEditor(field) {
    class RDGEditor extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                value: props.value
            };
        }

        getValue() {
            return {
                [field.id]: this.state.value
            };
        }

        getInputNode() {
            return ReactDOM.findDOMNode(this).getElementsByTagName("input")[0];
        }

        handleChange = value => {
            this.setState({
                value: getFieldConfiguration(field.type).getValueFromEvent(value)
            });
        }

        handleChangeComplete = value => {
            this.setState({
                value: getFieldConfiguration(field.type).getValueFromEvent(value)
            }, () => this.props.onCommit());
        }

        render() {
            const c = getFieldConfiguration(field.type);

            return c.input({
                [c.valuePropName]: this.state.value,
                onChange: c.commitOnChange ? this.handleChangeComplete : this.handleChange
            });
        }
    }

    return RDGEditor;
}

function TaskGrid(props) {
    const columns = props.fields.map(field => {
        return {
            width: getWidthForType(field.type),
            key: field.id,
            name: field.title,
            editable: true,
            resizable: true,
            formatter: createFormatter(field),
            editor: createEditor(field)
        };
    });

    const onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        for (let index = fromRow; index <= toRow; index++) {
            props.updateTask({
                ...props.tasks[index],
                ...updated
            });
        }
    };

    const dummy = false;

    let tasks = props.tasks;

    if (dummy) {
        tasks = createDummyTasks();
    }

    return (
        <ReactDataGrid
            minHeight={800}
            columns={columns}
            rowGetter={i => tasks[i]}
            rowsCount={tasks.length}
            onGridRowsUpdated={onGridRowsUpdated}
            enableCellSelect={true} />
    );
}

TaskGrid.propTypes = {
    fields: PropTypes.arrayOf(FieldPropType).isRequired,
    tasks: PropTypes.arrayOf(TaskPropType).isRequired,
    selectedTaskIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    setSelectedTaskIds: PropTypes.func.isRequired
}

// TODO remove
function createDummyTasks() {
    const tasks = [];

    for (let i = 0; i < 1000; i++) {
        tasks.push({
            id: 'task-dummy-' + i,
            refIds: {},
            creationDate: 1554795588054,
            updateDate: 1554897001063,
            status: 'TO_UPDATE',
            title: 'Task Dummy ' + i,
            color: '#ffffff',
            completed: false,
            importance: '0'
        })
    }

    return tasks;
}

export default withApp(withFields(withTasks(TaskGrid, { applySelectedFilter: true })));