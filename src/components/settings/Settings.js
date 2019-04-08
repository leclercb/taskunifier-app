import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { List, Row, Col } from 'antd';
import withSettings from '../../containers/WithSettings';
import { getCategories } from './Categories';
import Icon from '../common/Icon';

function Settings(props) {
    const [selectedCategoryId, setSelectedCategoryId] = useState('general');

    const categories = getCategories();
    const category = categories.find(category => category.id === selectedCategoryId);
    const settings = category.settings;

    const getSettingValue = (categoryId, settingId) => {
        if (settingId in props.settings.data) {
            return props.settings.data[settingId];
        } else {
            const category = categories.find(category => category.id === categoryId);
            return category.settings[settingId].value;
        }
    }

    const onCategorySelection = category => {
        setSelectedCategoryId(category.id);
    }

    return (
        <Row>
            <Col span={6}>
                <List
                    size="small"
                    bordered={true}
                    dataSource={categories}
                    renderItem={item => (
                        <List.Item onClick={() => onCategorySelection(item)}>
                            <Icon icon={item.icon} text={item.title} />
                        </List.Item>
                    )}
                />
            </Col>
            <Col span={2}>

            </Col>
            <Col span={16}>
                <List
                    size="small"
                    bordered={false}
                    dataSource={Object.keys(settings).filter(key => settings[key].visible)}
                    renderItem={item => {
                        const setting = settings[item];

                        return (
                            <List.Item>
                                {`${setting.title} : ${getSettingValue(selectedCategoryId, item)}`}
                            </List.Item>
                        );
                    }} />
            </Col>
        </Row>
    );
}

Settings.propTypes = {
    settings: PropTypes.object.isRequired
}

export default withSettings(Settings);