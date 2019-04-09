import React from 'react';
import { Tabs } from 'antd';
import ContextManager from '../contexts/ContextManager';
import FolderManager from '../folders/FolderManager';

function CategoryManager(props) {
    return (
        <Tabs defaultActiveKey="contexts">
            <Tabs.TabPane tab="Contexts" key="contexts">
                <ContextManager />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Folders" key="folders">
                <FolderManager />
            </Tabs.TabPane>
        </Tabs>
    );
}

export default CategoryManager;