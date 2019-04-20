import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { List, Row, Col, Form } from 'antd';
import withSettings from '../../containers/WithSettings';
import { getCategories } from '../../data/DataSettings';
import Icon from '../common/Icon';
import { getDefaultFormItemLayout, onFieldChangeForObjectUpdates } from '../../utils/FormUtils';
import {
    getInputForType,
    getNormalizeForType,
    getValueFromEventForType,
    getValuePropNameForType
} from '../../utils/FieldUtils';

function SettingManager(props) {
    const [selectedCategoryId, setSelectedCategoryId] = useState('general');

    const categories = getCategories();
    const category = categories.find(category => category.id === selectedCategoryId);
    const settings = category.settings;

    const getSettingValue = setting => {
        if (setting.id in props.settings) {
            return props.settings[setting.id];
        } else {
            return setting.value;
        }
    }

    const onCategorySelection = category => {
        setSelectedCategoryId(category.id);
    }

    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    return (
        <Row>
            <Col span={6}>
                <List
                    size="small"
                    bordered={true}
                    dataSource={categories}
                    renderItem={item => (
                        <List.Item
                            onClick={() => onCategorySelection(item)}
                            className={item.id === selectedCategoryId ? 'selected-list-item' : null}>
                            <Icon icon={item.icon} text={item.title} />
                        </List.Item>
                    )}
                />
            </Col>
            <Col span={2}>

            </Col>
            <Col span={16}>
                <Form {...formItemLayout}>
                    <List
                        size="small"
                        bordered={false}
                        dataSource={settings}
                        renderItem={item => (
                            <List.Item>
                                <Form.Item label={item.title} style={{ width: '100%' }}>
                                    {getFieldDecorator(item.id, {
                                        rules: [],
                                        normalize: getNormalizeForType(item.type),
                                        valuePropName: getValuePropNameForType(item.type),
                                        getValueFromEvent: getValueFromEventForType(item.type),
                                        initialValue: getNormalizeForType(item.type)(getSettingValue(item))
                                    })(
                                        getInputForType(item.type, item.options, { disabled: item.editable === false })
                                    )}
                                </Form.Item>
                            </List.Item>
                        )} />
                </Form>
            </Col>
        </Row>
    );
}

SettingManager.propTypes = {
    settings: PropTypes.object.isRequired,
    updateSettings: PropTypes.func.isRequired
};

export default withSettings(Form.create({
    name: 'settings',
    onFieldsChange: (props, fields) => onFieldChangeForObjectUpdates(fields, props.settings, props.updateSettings)
})(SettingManager));