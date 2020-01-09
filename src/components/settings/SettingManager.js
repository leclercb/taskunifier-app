import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, List, Row } from 'antd';
import Icon from 'components/common/Icon';
import PromiseButton from 'components/common/PromiseButton';
import SorterTable from 'components/filters/SorterTable';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { getCategories, getCategorySettings } from 'data/DataSettings';
import { useNoteFieldApi } from 'hooks/UseNoteFieldApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { getDefaultFormItemLayout, onCommitForm } from 'utils/FormUtils';

function SettingManager(props) {
    const noteFieldApi = useNoteFieldApi();
    const taskFieldApi = useTaskFieldApi();
    const settingsApi = useSettingsApi();

    const categories = getCategories().filter(category => !category.mode || category.mode === process.env.REACT_APP_MODE);
    const category = categories.find(category => category.id === props.category);
    const settings = getCategorySettings(
        category,
        {
            noteFields: noteFieldApi.noteFields,
            taskFields: taskFieldApi.taskFields
        }).filter(setting =>
            setting.visible !== false && (!setting.mode || setting.mode === process.env.REACT_APP_MODE));

    const getSettingValue = setting => {
        if (setting.id in settingsApi.settings) {
            return settingsApi.settings[setting.id];
        } else {
            return setting.value;
        }
    };

    const onCategorySelection = category => {
        props.onCategorySelection(category.id);
    };

    const { getFieldDecorator } = props.form;

    const formItemLayout = getDefaultFormItemLayout();

    const createElement = item => {
        switch (item.type) {
            case 'component':
                return (
                    <div style={{ width: '100%', margin: '20px 0px' }}>
                        {item.value(settingsApi.settings, settingsApi.updateSettings, settingsApi.dispatch)}
                    </div>
                );
            case 'sorters':
                return (
                    <Form.Item label={item.title} style={{ width: '100%' }}>
                        <SorterTable
                            sorters={settingsApi.settings[item.id]}
                            sorterFields={item.fields}
                            updateSorters={sorters => settingsApi.updateSettings({
                                [item.id]: sorters
                            })}
                            orderSettingPrefix="categorySorterColumnOrder_"
                            widthSettingPrefix="categorySorterColumnWidth_"
                            disabled={item.editable === false} />
                    </Form.Item>
                );
            default:
                return (
                    <Form.Item label={item.title} style={{ width: '100%' }}>
                        {item.type === 'button' ? (
                            <PromiseButton
                                type={item.buttonType}
                                onClick={() => item.value(settingsApi.settings, settingsApi.updateSettings, settingsApi.dispatch)}>
                                {item.title}
                            </PromiseButton>
                        ) : null}
                        {item.type === 'label' ? item.value(settingsApi.settings, settingsApi.updateSettings, settingsApi.dispatch) : null}
                        {item.type !== 'button' && item.type !== 'label' && item.type !== 'component' ? (
                            <React.Fragment>
                                {item.prefix}
                                {getFieldDecorator(item.id, {
                                    valuePropName: getValuePropNameForType(item.type),
                                    initialValue: getSettingValue(item)
                                })(
                                    getInputForType(
                                        item.type,
                                        item.options,
                                        {
                                            disabled: item.editable === false,
                                            onCommit: () => onCommitForm(props.form, {}, settingsApi.updateSettings)
                                        })
                                )}
                                {item.suffix}
                            </React.Fragment>
                        ) : null}
                    </Form.Item>
                );
        }
    };

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
                            className={item.id === props.category ? 'selected-list-item' : null}>
                            <Icon icon={item.icon} text={item.title} />
                        </List.Item>
                    )}
                />
            </Col>
            <Col span={2} />
            <Col span={16}>
                <Form {...formItemLayout}>
                    <List
                        size="small"
                        bordered={false}
                        dataSource={settings}
                        renderItem={item => (
                            <List.Item>
                                {createElement(item)}
                            </List.Item>
                        )} />
                </Form>
            </Col>
        </Row>
    );
}

SettingManager.propTypes = {
    form: PropTypes.object.isRequired,
    category: PropTypes.string.isRequired,
    onCategorySelection: PropTypes.func.isRequired
};

export default Form.create({ name: 'settings' })(SettingManager);