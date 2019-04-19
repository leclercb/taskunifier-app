import React from 'react';
import { Layout, Spin } from 'antd';
import Sider from './Sider';
import TaskGrid from '../taskgrid/TaskGrid';
import Header from './Header';
import Footer from './Footer';
import withStatus from '../../containers/WithStatus';
import ModalStatus from '../status/ModalStatus';
import ModalCategoryManager from '../categories/ModalCategoryManager';
import ModalFilterManager from '../filters/ModalFilterManager';
import SplitPane from 'react-split-pane';
import NotificationManager from '../status/NotificationManager';
import ModalTaskTemplateManager from '../tasktemplates/ModalTaskTemplateManager';
import ModalSettingManager from '../settings/ModalSettingManager';
import TaskQuickAdd from '../taskgrid/TaskQuickAdd';

function AppLayout(props) {
    return (
        <React.Fragment>
            <NotificationManager />
            <ModalStatus />
            <ModalCategoryManager />
            <ModalFilterManager />
            <ModalTaskTemplateManager />
            <ModalSettingManager />
            <Spin style={{ minHeight: "100%", height: "100%" }} spinning={props.status.busy}>
                <Layout style={{ minHeight: "100%", height: "100%" }}>
                    <Layout.Header>
                        <Header />
                    </Layout.Header>
                    <Layout style={{ height: "100%", position: "relative" }}>
                        <SplitPane split="vertical" minSize={200} defaultSize={300} paneStyle={{ overflowY: 'auto' }}>
                            <Sider />
                            <React.Fragment>
                                <TaskQuickAdd />
                                <div style={{ overflowY: 'auto', height: '100%' }}>
                                    <TaskGrid />
                                </div>
                            </React.Fragment>
                        </SplitPane>
                    </Layout>
                    <Layout.Footer style={{ textAlign: 'center' }}>
                        <Footer />
                    </Layout.Footer>
                </Layout>
            </Spin>
        </React.Fragment>
    );
}

export default withStatus(AppLayout);