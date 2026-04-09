import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import LayoutSider from './components/LayoutSider'

const { Header, Sider, Content } = Layout

function AppLayout() {
  return (
    <Layout className="h-full">
      <Sider theme="light" style={{ background: '#fff' }}>
        <LayoutSider />
      </Sider>
      <Layout>
        <Header>
          <h1>Flow Process Form</h1>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
