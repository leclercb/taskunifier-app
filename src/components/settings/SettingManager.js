import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, List, Row } from 'antd';
import Icon from 'components/common/Icon';
import PromiseButton from 'components/common/PromiseButton';
import SorterTable from 'components/filters/SorterTable';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { getGeneralNoteFilters } from 'data/DataNoteFilters';
import { getCategories, getCategorySettings } from 'data/DataSettings';
import { getGeneralTaskFilters } from 'data/DataTaskFilters';
import { useNoteFieldApi } from 'hooks/UseNoteFieldApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { getDefaultFormItemLayout, onCommitForm } from 'utils/FormUtils';

function SettingManager(props) {
    const noteFieldApi = useNoteFieldApi();
    const taskFieldApi = useTaskFieldApi();
    const settingsApi = useSettingsApi();

    const [form] = Form.useForm();

    const categories = getCategories().filter(category => !category.mode || category.mode === process.env.REACT_APP_MODE);
    const category = categories.find(category => category.id === props.category);
    const settings = getCategorySettings(
        category,
        {
            generalNoteFilters: getGeneralNoteFilters(),
            noteFields: noteFieldApi.noteFields,
            generalTaskFilters: getGeneralTaskFilters(),
            taskFields: taskFieldApi.taskFields
        }).filter(setting =>
            setting.visible !== false && (!setting.mode || setting.mode === process.env.REACT_APP_MODE));

    const onCategorySelection = category => {
        props.onCategorySelection(category.id);
    };

    const formItemLayout = getDefaultFormItemLayout();

    const createElement = item => {
        switch (item.type) {
            case 'button':
                return (
                    <Form.Item label={item.title} style={{ width: '100%' }}>
                        <PromiseButton
                            type={item.buttonType}
                            onClick={() => item.value(settingsApi.settings, settingsApi.updateSettings, settingsApi.dispatch)}>
                            {item.title}
                        </PromiseButton>
                    </Form.Item>
                );
            case 'component':
                return (
                    <div style={{ width: '100%', margin: '20px 0px' }}>
                        {item.value(settingsApi.settings, settingsApi.updateSettings, settingsApi.dispatch)}
                    </div>
                );
            case 'label':
                return (
                    <Form.Item label={item.title} style={{ width: '100%' }}>
                        {item.value(settingsApi.settings, settingsApi.updateSettings, settingsApi.dispatch)}
                    </Form.Item>
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
                    <Form.Item
                        name={item.id}
                        label={item.title}
                        valuePropName={getValuePropNameForType(item.type)}
                        style={{ width: '100%' }}>
                        {item.prefix}
                        {getInputForType(
                            item.type,
                            item.options,
                            {
                                disabled: item.editable === false,
                                onCommit: () => onCommitForm(form, {}, settingsApi.updateSettings)
                            })}
                        {item.suffix}
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
                <Form form={form} initialValues={settingsApi.settings} {...formItemLayout}>
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
    category: PropTypes.string.isRequired,
    onCategorySelection: PropTypes.func.isRequired
};

export default SettingManager;