import React from 'react';
import { Layout, Spin } from 'antd';
import Sider from './Sider';
import TaskGrid from '../tasks/TaskGrid';
import Header from './Header';
import Footer from './Footer';
import withProcesses from '../../containers/WithProcesses';
import ModalProcessManager from '../processes/ModalProcessManager';
import ModalCategoryManager from '../categories/ModalCategoryManager';
import ModalFilterManager from '../filters/ModalFilterManager';
import SplitPane from 'react-split-pane';
import NotificationManager from '../processes/NotificationManager';
import ModalTaskTemplateManager from '../tasktemplates/ModalTaskTemplateManager';
import ModalSettingManager from '../settings/ModalSettingManager';
import ModalBatchAddTasks from '../tasks/ModalBatchAddTasks';
import TaskQuickAdd from '../tasks/TaskQuickAdd';

function AppLayout(props) {
    return (
        <React.Fragment>
            <NotificationManager />
            <ModalProcessManager />
            <ModalCategoryManager />
            <ModalFilterManager />
            <ModalTaskTemplateManager />
            <ModalSettingManager />
            <ModalBatchAddTasks />
            <Spin style={{ minHeight: "100%", height: "100%" }} spinning={props.processes.busy}>
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

export default withProcesses(AppLayout);