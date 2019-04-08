import React from 'react';
import { Layout, Spin } from 'antd';
import Sider from './Sider';
import TaskGrid from '../taskgrid/TaskGrid';
import Header from './Header';
import Footer from './Footer';
import withStatus from '../../containers/WithStatus';
import ModalStatus from '../status/ModalStatus';
import ModalSettings from '../settings/ModalSettings';
import ModalManageCategories from '../categories/ModalManageCategories';

function AppLayout(props) {
    return (
        <React.Fragment>
            <ModalSettings />
            <ModalStatus />
            <ModalManageCategories />
            <Spin style={{ minHeight: "100%", height: "100%" }} spinning={props.status.busy}>
                <Layout style={{ minHeight: "100%", height: "100%" }}>
                    <Layout.Header>
                        <Header />
                    </Layout.Header>
                    <Layout style={{ height: "100%" }}>
                        <Layout.Sider width={300} theme="light">
                            <Sider />
                        </Layout.Sider>
                        <Layout.Content>
                            <TaskGrid />
                        </Layout.Content>
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