import React from 'react';
import { Layout, Spin } from 'antd';
import SiderMenu from '../sidermenu/SiderMenu';
import TaskGrid from '../taskgrid/TaskGrid';
import HeaderMenu from '../headermenu/HeaderMenu';
import AppFooter from '../appfooter/AppFooter';
import Login from '../oauth/Login';
import withStatus from '../../containers/WithStatus';
import ModalStatus from '../status/ModalStatus';
import ModalSettings from '../settings/ModalSettings';

const {
    Header, Footer, Sider, Content,
} = Layout;

function AppLayout(props) {
    return (
        <React.Fragment>
            <ModalSettings />
            <ModalStatus />
            <Spin spinning={props.status.busy}>
                <Layout style={{ minHeight: "100%", height: "100%" }}>
                    <Header>
                        <HeaderMenu />
                    </Header>
                    <Layout style={{ height: "100%" }}>
                        <Sider width={250} theme="light">
                            <SiderMenu />
                        </Sider>
                        <Content>
                            <TaskGrid />
                        </Content>
                    </Layout>
                    <Footer style={{ textAlign: 'center' }}>
                        <AppFooter />
                    </Footer>
                </Layout>
            </Spin>
        </React.Fragment>
    );
}

export default withStatus(AppLayout);