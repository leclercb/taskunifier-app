import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Col, Form, Row } from 'antd';
import Icon from 'components/common/Icon';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTaskApi } from 'hooks/UseTaskApi';
import { getDefaultFormItemLayout } from 'utils/FormUtils';
import { clone } from 'utils/ObjectUtils';

function BatchEditTasksManager(props) {
    const settingsApi = useSettingsApi();
    const taskApi = useTaskApi();
    const taskFieldApi = useTaskFieldApi();

    const updateTasks = () => {
        props.form.validateFields((error, values) => {
            if (error) {
                return;
            }

            const tasks = taskApi.selectedTasks.map(task => ({ ...task }));

            taskFieldApi.taskFields.forEach(field => {
                if (values.checked[field.id]) {
                    tasks.forEach(task => {
                        task[field.id] = clone(values.value[field.id]);
                    });
                }
            });

            tasks.forEach(task => taskApi.updateTask(task));
        });
    };

    const fields = taskFieldApi.taskFields.filter(field => settingsApi.settings['taskFieldVisible_' + field.id] !== false);

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
    form: PropTypes.object.isRequired
};

export default Form.create({ name: 'batchEditTasks' })(BatchEditTasksManager);