import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Spin } from 'antd';
import Header from './Header';
import Footer from './Footer';
import withApp from '../../containers/WithApp';
import withProcesses from '../../containers/WithProcesses';
import withSettings from '../../containers/WithSettings';
import ModalProcessManager from '../processes/ModalProcessManager';
import ModalCategoryManager from '../categories/ModalCategoryManager';
import ModalTaskFilterManager from '../taskfilters/ModalTaskFilterManager';
import NotificationManager from '../processes/NotificationManager';
import ModalTaskTemplateManager from '../tasktemplates/ModalTaskTemplateManager';
import ModalSettingManager from '../settings/ModalSettingManager';
import ModalBatchAddTasks from '../tasks/batch/ModalBatchAddTasks';
import TaskView from '../tasks/views/TaskView';
import TaskCalendarView from '../tasks/views/TaskCalendarView';

function AppLayout(props) {
    const getView = () => {
        switch (props.selectedView) {
            case 'task':
                return <TaskView />;
            case 'task-calendar':
                return <TaskCalendarView />;
            default:
                return <TaskView />;
        }
    };

    return (
        <React.Fragment>
            <NotificationManager />
            <ModalProcessManager />
            <ModalCategoryManager />
            <ModalTaskFilterManager />
            <ModalTaskTemplateManager />
            <ModalSettingManager />
            <ModalBatchAddTasks />
            <Spin style={{ minHeight: "100%", height: "100%" }} spinning={props.processes.busy}>
                <Layout style={{ minHeight: "100%", height: "100%" }}>
                    <Layout.Header>
                        <Header />
                    </Layout.Header>
                    <Layout style={{ height: "100%", position: "relative" }}>
                        {getView()}
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

export default withApp(withProcesses(withSettings(AppLayout)));