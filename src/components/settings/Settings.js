import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { List, Row, Col, Form, Button, Divider } from 'antd';
import withSettings from '../../containers/WithSettings';
import { getCategories } from '../../data/DataSettings';
import Icon from '../common/Icon';
import { merge } from '../../utils/ObjectUtils';
import { getDefaultFormItemLayout, getDefaultTailFormItemLayout } from '../../utils/FormUtils';
import { getInputForType, getValuePropName } from '../../utils/FieldUtils';

function Settings(props) {
    const [selectedCategoryId, setSelectedCategoryId] = useState('general');

    const categories = getCategories();
    const category = categories.find(category => category.id === selectedCategoryId);
    const settings = category.settings;

    const getSettingValue = setting => {
        if (setting.id in props.settings.data) {
            return props.settings.data[setting.id];
        } else {
            return setting.value;
        }
    }

    const onCategorySelection = category => {
        setSelectedCategoryId(category.id);
    }

    const onSave = (e) => {
        e.preventDefault();
        props.form.validateFieldsAndScroll((err, values) => {
            console.log(err, values);
            if (!err) {
                const updatedSettings = merge({ ...props.settings }, values);
                props.updateSettings(updatedSettings);
            }
        });
    }

    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();
    const tailFormItemLayout = getDefaultTailFormItemLayout();

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
                <Form {...formItemLayout} onSubmit={onSave}>
                    <List
                        size="small"
                        bordered={false}
                        dataSource={settings}
                        renderItem={item => (
                            <List.Item>
                                <Form.Item label={item.title} style={{ width: '100%' }}>
                                    {getFieldDecorator(item.id, {
                                        valuePropName: getValuePropName(item.type),
                                        initialValue: getSettingValue(item)
                                    })(
                                        getInputForType(item.type, { disabled: item.editable === false })
                                    )}
                                </Form.Item>
                            </List.Item>
                        )} />
                    <Divider />
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            <Icon icon="save" color="#ffffff" text="Save" />
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
}

Settings.propTypes = {
    settings: PropTypes.object.isRequired,
    updateSettings: PropTypes.func.isRequired
};

export default withSettings(Form.create({ name: 'settings' })(Settings));