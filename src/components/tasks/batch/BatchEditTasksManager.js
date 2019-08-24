import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Col, Form, Row } from 'antd';
import Icon from 'components/common/Icon';
import withSelectedTasks from 'containers/WithSelectedTasks';
import withSettings from 'containers/WithSettings';
import withTaskFields from 'containers/WithTaskFields';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { TaskPropType } from 'proptypes/TaskPropTypes';
import { getDefaultFormItemLayout, getDefaultTailFormItemLayout } from 'utils/FormUtils';
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

    const fields = props.taskFields.filter(field => props.settings['taskFieldVisible_' + field.id] !== false);

    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    return (
        <Row gutter={20}>
            <Form {...formItemLayout}>
                {fields.map(field => (
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
                                getInputForType(field.type, field.options, { disabled: !field.editable })
                            )}
                        </Form.Item>
                    </Col>
                ))}
                <Col span={24}>
                    <div style={{ width: '90%', textAlign: 'right' }}>
                        <Button onClick={() => updateTasks()}>
                            <Icon icon="plus" text="Batch edit tasks" />
                        </Button>
                    </div>
                </Col>
            </Form>
        </Row>
    );
}

BatchEditTasksManager.propTypes = {
    form: PropTypes.object.isRequired,
    taskFields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired,
    selectedTasks: PropTypes.arrayOf(TaskPropType).isRequired,
    settings: SettingsPropType.isRequired,
    updateTask: PropTypes.func.isRequired
};

export default withSettings(withTaskFields(withSelectedTasks(Form.create({ name: 'batchEditTasks' })(BatchEditTasksManager))));