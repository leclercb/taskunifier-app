import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Spin } from 'antd';
import SplitPane from 'react-split-pane';
import TaskSider from '../tasks/sider/TaskSider';
import TaskGrid from '../tasks/grid/TaskGrid';
import Header from './Header';
import Footer from './Footer';
import withProcesses from '../../containers/WithProcesses';
import withSettings from '../../containers/WithSettings';
import ModalProcessManager from '../processes/ModalProcessManager';
import ModalCategoryManager from '../categories/ModalCategoryManager';
import ModalFilterManager from '../filters/ModalFilterManager';
import NotificationManager from '../processes/NotificationManager';
import ModalTaskTemplateManager from '../tasktemplates/ModalTaskTemplateManager';
import ModalSettingManager from '../settings/ModalSettingManager';
import ModalBatchAddTasks from '../tasks/batch/ModalBatchAddTasks';
import TaskQuickAdd from '../tasks/quick/TaskQuickAdd';
import TaskTabs from '../tasks/tabs/TaskTabs';

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
                        <SplitPane
                            split="vertical"
                            minSize={200}
                            defaultSize={props.settings.verticalSplitPaneSize}
                            onChange={size => props.updateSettings({ verticalSplitPaneSize: size })}
                            paneStyle={{ overflowY: 'auto' }}>
                            <TaskSider />
                            <SplitPane
                                split="horizontal"
                                minSize={200}
                                defaultSize={props.settings.horizontalSplitPaneSize}
                                onChange={size => props.updateSettings({ horizontalSplitPaneSize: size })}
                                primary="second"
                                paneStyle={{ overflowY: 'auto' }}>
                                <div style={{ height: '100%' }}>
                                    <TaskQuickAdd />
                                    <div style={{ overflowY: 'auto', height: '100%' }}>
                                        <TaskGrid />
                                    </div>
                                </div>
                                <div style={{ padding: 10, width: '100%' }}>
                                    <TaskTabs />
                                </div>
                            </SplitPane>
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

AppLayout.propTypes = {
    processes: PropTypes.shape({
        busy: PropTypes.bool.isRequired
    }).isRequired
}

export default withProcesses(withSettings(AppLayout));