import React from 'react';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { Col, Collapse, Form, Row } from 'antd';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { TaskPropType } from 'proptypes/TaskPropTypes';

function TaskEditionForm(props) {
    const settingsApi = useSettingsApi();
    const taskFieldApi = useTaskFieldApi();

    const { getFieldDecorator } = props.form;

    const formItemLayout = {
        labelCol: {
            span: 8
        },
        wrapperCol: {
            span: 16
        }
    };

    const sortedFields = sortBy(taskFieldApi.taskFields, field => ('taskColumnOrder_' + field.id) in settingsApi.settings ? settingsApi.settings['taskColumnOrder_' + field.id] : field.defaultOrder || 0);
    const sortedAndFilteredFields = sortedFields.filter(field => settingsApi.settings['taskFieldVisible_' + field.id] !== false);

    const textField = sortedAndFilteredFields.find(field => field.id === 'text');

    return (
        <Row gutter={20}>
            <Form {...formItemLayout}>
                {sortedAndFilteredFields.filter(field => field.id !== 'text').map(field => (
                    <Col key={field.id} span={12}>
                        <Form.Item label={field.title}>
                            {getFieldDecorator(field.id, {
                                valuePropName: getValuePropNameForType(field.type),
                                initialValue: props.task[field.id]
                            })(
                                getInputForType(field.type, field.options, { disabled: !field.editable })
                            )}
                        </Form.Item>
                    </Col>
                ))}
                {textField && (
                    <Col key={textField.id} span={24}>
                        <Collapse bordered={false}>
                            <Collapse.Panel header="Text" key="text">
                                <div style={{ height: 200 }}>
                                    {getFieldDecorator(textField.id, {
                                        valuePropName: getValuePropNameForType(textField.type),
                                        initialValue: props.task[textField.id]
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
}

TaskEditionForm.propTypes = {
    form: PropTypes.object.isRequired,
    task: TaskPropType.isRequired
};

export default TaskEditionForm;