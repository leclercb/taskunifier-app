import React from 'react';
import { Layout } from 'antd';
import SiderMenu from '../sidermenu/SiderMenu';
import TaskGrid from '../taskgrid/TaskGrid';
import HeaderMenu from '../headermenu/HeaderMenu';
import AppFooter from '../appfooter/AppFooter';
import Login from '../oauth/Login';

const {
    Header, Footer, Sider, Content,
} = Layout;

function AppLayout() {
    return (
        <React.Fragment>
            <Login/>
            <Layout style={{minHeight: "100%", height: "100%"}}>
                <Header>
                    <HeaderMenu />
                </Header>
                <Layout style={{height: "100%"}}>
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
        </React.Fragment>
    );
}

export default AppLayout;