import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Col, Form, Row } from 'antd';
import Icon from 'components/common/Icon';
import withSelectedTasks from 'containers/WithSelectedTasks';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { TaskPropType } from 'proptypes/TaskPropTypes';
import { getDefaultFormItemLayout, getDefaultTailFormItemLayout } from 'utils/FormUtils';
import withTaskFields from 'containers/WithTaskFields';
import { clone } from 'utils/ObjectUtils';

function BatchEditTasksManager(props) {
    const updateTasks = () => {
        props.form.validateFields((error, values) => {
            if (error) {
                return;
            }

            const tasks = props.selectedTasks.map(task => ({ ...task }));

            props.taskFields.forEach(field => {
                if (values.checked[field.id]) {
                    tasks.forEach(task => {
                        task[field.id] = clone(values.value[field.id]);
                    });
                }
            });

            tasks.forEach(task => props.updateTask(task));
        });
    };

    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();
    const tailFormItemLayout = getDefaultTailFormItemLayout();

    return (
        <Row gutter={20}>
            <Form {...formItemLayout}>
                {props.taskFields.map(field => (
                    <Col key={field.id} span={12}>
                        <Form.Item label={(
                            getFieldDecorator('checked.' + field.id, {
                                valuePropName: 'checked'
                            })(
                                <Checkbox>{field.title}</Checkbox>
                            )
                        )}>
                            {getFieldDecorator('value.' + field.id, {
                                valuePropName: getValuePropNameForType(field.type)
                            })(
                                getInputForType(field.type, field.options)
                            )}
                        </Form.Item>
                    </Col>
                ))}
                <Col span={12}>
                    <Form.Item {...tailFormItemLayout}>
                        <Button onClick={() => updateTasks()}>
                            <Icon icon="plus" text="Batch edit tasks" />
                        </Button>
                    </Form.Item>
                </Col>
            </Form>
        </Row>
    );
}

BatchEditTasksManager.propTypes = {
    form: PropTypes.object.isRequired,
    taskFields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired,
    selectedTasks: PropTypes.arrayOf(TaskPropType).isRequired,
    updateTask: PropTypes.func.isRequired
};

export default withTaskFields(withSelectedTasks(Form.create({ name: 'batchEditTasks' })(BatchEditTasksManager)));