import React, { useState } from 'react';
import { useNavigate, Outlet } from "react-router-dom";
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

import '../static/css/AdminIndex.css';

import { Route, Routes } from "react-router-dom";
import AddArticle from './AddArticle'
import ArticleList from './ArticleList'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const AdminIndex = () => {

  let navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  }

  const handleClickArticle = e => {
    console.log(e.key)
    if (e.key == 'addArticle') {
      navigate('/article/add');
    } else {
      navigate('/article/list');
    }

  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          {/* <Menu.Item key="1" icon={<PieChartOutlined />} key="addArticle">
            添加文章
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />} key="articleList">
            文章列表
          </Menu.Item> */}
          <SubMenu key="sub1" onClick={handleClickArticle}
            icon={<UserOutlined />} title="文章管理"
          >
            <Menu.Item key="addArticle">添加文章</Menu.Item>
            <Menu.Item key="articleList">文章列表</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9" icon={<FileOutlined />}>
            Files
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>后台管理</Breadcrumb.Item>
            <Breadcrumb.Item>工作台</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <div>
              <Outlet />
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>https://create-react-app.dev/</Footer>
      </Layout>
    </Layout>
  )
}

export default AdminIndex