import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { getGoalFields } from 'data/DataGoalFields';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { GoalPropType } from 'proptypes/GoalPropTypes';
import { getDefaultFormItemLayout, onCommitForm } from 'utils/FormUtils';

function GoalForm({ goal, updateGoal }) {
    const settingsApi = useSettingsApi();

    const [form] = Form.useForm();

    const fields = getGoalFields(settingsApi.settings);

    const formItemLayout = getDefaultFormItemLayout();

    const titleRef = useRef(null);

    useEffect(() => {
        form.resetFields();

        if (titleRef.current && !goal.title) {
            titleRef.current.focus();
        }
    }, [goal]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Form form={form} initialValues={goal} {...formItemLayout}>
            {fields.filter(field => field.visible !== false).map(field => {
                const fieldProps = {};

                if (field.type === 'goalContributesTo') {
                    fieldProps.excludeIds = [goal.id];
                    fieldProps.disabled = goal.level === 'lifeTime';
                }

                return (
                    <Form.Item
                        key={field.id}
                        name={field.id}
                        label={field.title}
                        valuePropName={getValuePropNameForType(field.type)}>
                        {getInputForType(
                            field.type,
                            field.options,
                            {
                                ...fieldProps,
                                ref: field.id === 'title' ? titleRef : undefined,
                                onCommit: () => onCommitForm(form, goal, updateGoal)
                            })}
                    </Form.Item>
                );
            })}
        </Form>
    );
}

GoalForm.propTypes = {
    goal: GoalPropType.isRequired,
    updateGoal: PropTypes.func.isRequired
};

export default GoalForm;