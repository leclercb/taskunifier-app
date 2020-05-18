import React, { forwardRef, useImperativeHandle } from 'react';
import { Checkbox, Col, Collapse, Form, Row, message } from 'antd';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import withBusyCheck from 'containers/WithBusyCheck';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTaskApi } from 'hooks/UseTaskApi';
import { getDefaultFormItemLayout } from 'utils/FormUtils';
import { clone } from 'utils/ObjectUtils';

const BatchEditTasksManager = forwardRef(function BatchEditTasksManager({ apis, form, onSuccess }, ref) {
    const { settingsApi, taskApi, taskFieldApi } = apis;

    const updateTasks = async () => {
        try {
            const values = await form.validateFields();

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
        } catch (error) {
            // Skip
        }
    };

    useImperativeHandle(ref, () => ({
        updateTasks
    }));

    const formItemLayout = getDefaultFormItemLayout();

    const sortedFields = sortBy(taskFieldApi.taskFields, field => ('taskColumnOrder_' + field.id) in settingsApi.settings ? settingsApi.settings['taskColumnOrder_' + field.id] : field.defaultOrder || 0);
    const sortedAndFilteredFields = sortedFields.filter(field => settingsApi.settings['taskFieldVisible_' + field.id] !== false);

    const textField = sortedAndFilteredFields.find(field => field.id === 'text');

    return (
        <Form form={form} {...formItemLayout}>
            <Row gutter={20}>
                {sortedAndFilteredFields.filter(field => field.id !== 'text').map(field => (
                    <Col key={field.id} span={12}>
                        <Form.Item
                            name={['value', field.id]}
                            label={(
                                <Form.Item
                                    noStyle
                                    name={['checked', field.id]}
                                    valuePropName="checked">
                                    <Checkbox>{field.title}</Checkbox>
                                </Form.Item>
                            )}
                            valuePropName={getValuePropNameForType(field.type)}>
                            {getInputForType(field.type, field.options, { disabled: !field.editable })}
                        </Form.Item>
                    </Col>
                ))}
                {textField && (
                    <Col key={textField.id} span={24}>
                        <Collapse bordered={false}>
                            <Collapse.Panel key="text" header={(
                                <Form.Item
                                    noStyle
                                    name={['checked', textField.id]}
                                    valuePropName="checked">
                                    <Checkbox>Text</Checkbox>
                                </Form.Item>
                            )}>
                                <div style={{ height: 200 }}>
                                    <Form.Item
                                        noStyle
                                        name={['value', textField.id]}
                                        valuePropName={getValuePropNameForType(textField.type)}>
                                        {getInputForType(textField.type, textField.options, { disabled: !textField.editable })}
                                    </Form.Item>
                                </div>
                            </Collapse.Panel>
                        </Collapse>
                    </Col>
                )}
            </Row>
        </Form>
    );
});

BatchEditTasksManager.displayName = 'BatchEditTasksManager';

BatchEditTasksManager.propTypes = {
    apis: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired
};

export default withBusyCheck(BatchEditTasksManager, () => ({
    settingsApi: useSettingsApi(),
    taskApi: useTaskApi(),
    taskFieldApi: useTaskFieldApi()
}));