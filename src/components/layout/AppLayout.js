import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Spin } from 'antd';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import withApp from 'containers/WithApp';
import withBusy from 'containers/WithBusy';
import withProcesses from 'containers/WithProcesses';
import withSettings from 'containers/WithSettings';
import ModalProcessManager from '../processes/ModalProcessManager';
import ModalCategoryManager from '../categories/ModalCategoryManager';
import ModalNoteFilterManager from '../notefilters/ModalNoteFilterManager';
import ModalTaskFilterManager from '../taskfilters/ModalTaskFilterManager';
import NotificationManager from '../processes/NotificationManager';
import ModalTaskTemplateManager from '../tasktemplates/ModalTaskTemplateManager';
import ModalSettingManager from '../settings/ModalSettingManager';
import ModalBatchAddTasks from '../tasks/batch/ModalBatchAddTasks';
import NoteView from '../notes/views/NoteView';
import TaskView from '../tasks/views/TaskView';
import TaskCalendarView from '../tasks/views/TaskCalendarView';

function AppLayout(props) {
    const getView = () => {
        switch (props.selectedView) {
            case 'note':
                return <NoteView />;
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
            <ModalNoteFilterManager />
            <ModalTaskFilterManager />
            <ModalTaskTemplateManager />
            <ModalSettingManager />
            <ModalBatchAddTasks />
            <Spin style={{ minHeight: '100%', height: '100%' }} spinning={props.busy}>
                <Layout style={{ minHeight: '100%', height: '100%' }}>
                    <Layout.Header>
                        <Header />
                    </Layout.Header>
                    <Layout style={{ height: '100%', position: 'relative' }}>
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
    busy: PropTypes.bool.isRequired
};

export default withApp(withProcesses(withSettings(withBusy(AppLayout))));