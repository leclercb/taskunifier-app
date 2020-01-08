import React, { forwardRef, useImperativeHandle } from 'react';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { Checkbox, Col, Collapse, Form, Row, message } from 'antd';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTaskApi } from 'hooks/UseTaskApi';
import { getDefaultFormItemLayout } from 'utils/FormUtils';
import { clone } from 'utils/ObjectUtils';

export const BatchEditTasksManager = forwardRef(function BatchEditTasksManager({ form, onSuccess }, ref) {
    const settingsApi = useSettingsApi();
    const taskApi = useTaskApi();
    const taskFieldApi = useTaskFieldApi();

    const updateTasks = () => {
        form.validateFields((error, values) => {
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

            message.success('Tasks sucessfully updated');
            onSuccess();
            form.resetFields();
        });
    };

    useImperativeHandle(ref, () => ({
        updateTasks
    }));

    const { getFieldDecorator } = form;

    const formItemLayout = getDefaultFormItemLayout();

    const sortedFields = sortBy(taskFieldApi.taskFields, field => ('taskColumnOrder_' + field.id) in settingsApi.settings ? settingsApi.settings['taskColumnOrder_' + field.id] : field.defaultOrder || 0);
    const sortedAndFilteredFields = sortedFields.filter(field => settingsApi.settings['taskFieldVisible_' + field.id] !== false);

    const textField = sortedAndFilteredFields.find(field => field.id === 'text');

    return (
        <Row gutter={20}>
            <Form {...formItemLayout}>
                {sortedAndFilteredFields.filter(field => field.id !== 'text').map(field => (
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
                {textField && (
                    <Col key={textField.id} span={24}>
                        <Collapse bordered={false}>
                            <Collapse.Panel key="text" header={(
                                getFieldDecorator('checked.' + textField.id, {
                                    valuePropName: 'checked'
                                })(
                                    <Checkbox>Text</Checkbox>
                                )
                            )}>
                                <div style={{ height: 200 }}>
                                    {getFieldDecorator('value.' + textField.id, {
                                        valuePropName: getValuePropNameForType(textField.type)
                                    })(
                                        getInputForType(textField.type, textField.options, { disabled: !textField.editable })
                                    )}
                                </div>
                            </Collapse.Panel>
                        </Collapse>
                    </Col>
                )}
            </Form>
        </Row>
    );
});

BatchEditTasksManager.displayName = 'BatchEditTasksManager';

BatchEditTasksManager.propTypes = {
    form: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired
};

export default Form.create({ name: 'batchEditTasks' })(BatchEditTasksManager);