import React from 'react';
import { Tabs } from 'antd';
import ContextManager from '../contexts/ContextManager';

function CategoryManager(props) {
    return (
        <Tabs defaultActiveKey="contexts">
            <Tabs.TabPane tab="Contexts" key="contexts">
                <ContextManager />
            </Tabs.TabPane>
        </Tabs>
    );
}

export default CategoryManager;