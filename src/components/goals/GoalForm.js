import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { getGoalFields } from 'data/DataGoalFields';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { GoalPropType } from 'proptypes/GoalPropTypes';
import { getDefaultFormItemLayout, onCommitForm } from 'utils/FormUtils';

function GoalForm(props) {
    const fields = getGoalFields();

    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    return (
        <Form {...formItemLayout}>
            {fields.filter(field => field.visible !== false).map(field => {
                const fieldProps = {};

                if (field.type === 'goalContributesTo') {
                    fieldProps.excludeIds = [props.goal.id];
                    fieldProps.disabled = props.goal.level === 'lifeTime';
                }

                return (
                    <Form.Item key={field.id} label={field.title}>
                        {getFieldDecorator(field.id, {
                            valuePropName: getValuePropNameForType(field.type),
                            initialValue: props.goal[field.id]
                        })(
                            getInputForType(
                                field.type,
                                field.options,
                                {
                                    ...fieldProps,
                                    onCommit: () => onCommitForm(props.form, props.goal, props.updateGoal)
                                })
                        )}
                    </Form.Item>
                );
            })}
        </Form>
    );
}

GoalForm.propTypes = {
    form: PropTypes.object.isRequired,
    goal: GoalPropType.isRequired,
    updateGoal: PropTypes.func.isRequired
};

export default Form.create({ name: 'goal' })(GoalForm);