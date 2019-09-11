import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, Row } from 'antd';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { useSettings } from 'hooks/UseSettings';
import { useTaskFields } from 'hooks/UseTaskFields';
import { TaskPropType } from 'proptypes/TaskPropTypes';

function TaskEditionForm(props) {
    const settingsApi = useSettings();
    const taskFieldApi = useTaskFields();

    const { getFieldDecorator } = props.form;

    const formItemLayout = {
        labelCol: {
            span: 8
        },
        wrapperCol: {
            span: 16
        }
    };

    const fields = taskFieldApi.taskFields.filter(field => settingsApi.settings['taskFieldVisible_' + field.id] !== false);

    return (
        <Row gutter={20}>
            <Form {...formItemLayout}>
                {fields.map(field => (
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
            </Form>
        </Row>
    );
}

TaskEditionForm.propTypes = {
    form: PropTypes.object.isRequired,
    task: TaskPropType.isRequired
};

export default TaskEditionForm;