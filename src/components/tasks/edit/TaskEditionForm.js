import React, { useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { Col, Collapse, Form, Row } from 'antd';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { TaskPropType } from 'proptypes/TaskPropTypes';

function TaskEditionForm({ form, task }) {
    const settingsApi = useSettingsApi();
    const taskFieldApi = useTaskFieldApi();

    const formItemLayout = {
        labelCol: {
            span: 8
        },
        wrapperCol: {
            span: 16
        }
    };

    useEffect(() => {
        form.resetFields();
    }, [task.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const sortedFields = sortBy(taskFieldApi.taskFields, field => ('taskColumnOrder_' + field.id) in settingsApi.settings ? settingsApi.settings['taskColumnOrder_' + field.id] : field.defaultOrder || 0);
    const sortedAndFilteredFields = sortedFields.filter(field => settingsApi.settings['taskFieldVisible_' + field.id] !== false);

    const textField = sortedAndFilteredFields.find(field => field.id === 'text');

    return (
        <Form form={form} initialValues={task} {...formItemLayout}>
            <Row gutter={20}>
                {sortedAndFilteredFields.filter(field => field.id !== 'text').map(field => (
                    <Col key={field.id} span={12}>
                        <Form.Item
                            name={field.id}
                            label={field.title}
                            valuePropName={getValuePropNameForType(field.type)}>
                            {getInputForType(field.type, field.options, { disabled: !field.editable })}
                        </Form.Item>
                    </Col>
                ))}
                {textField && (
                    <Col key={textField.id} span={24}>
                        <Collapse bordered={false}>
                            <Collapse.Panel key="text" header="Text">
                                <div style={{ height: 200 }}>
                                    <Form.Item
                                        noStyle
                                        name={textField.id}
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
}

TaskEditionForm.propTypes = {
    form: PropTypes.object.isRequired,
    task: TaskPropType.isRequired
};

export default TaskEditionForm;