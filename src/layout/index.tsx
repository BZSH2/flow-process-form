import { Layout } from 'antd'
import { useState, useSyncExternalStore } from 'react'
import { Outlet } from 'react-router-dom'
import LayoutSider from './components/LayoutSider'
import LayoutHeader from './components/LayoutHeader'
import { getDeviceSnapshot, subscribeViewportResize } from './resize'

const { Content } = Layout

function AppLayout() {
  const [collapse, setCollapse] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const deviceType = useSyncExternalStore(
    subscribeViewportResize,
    getDeviceSnapshot,
    () => 'desktop'
  )
  const isMobile = deviceType === 'mobile'
  const isTablet = deviceType === 'tablet'
  const siderCollapsed = isTablet ? true : collapse

  const handleToggleCollapse = () => {
    setCollapse((prev) => !prev)
  }
  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <Layout className="h-full">
      <LayoutSider
        collapse={siderCollapsed}
        onToggleCollapse={handleToggleCollapse}
        isMobile={isMobile}
        isTablet={isTablet}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={handleCloseMobileMenu}
      />
      <Layout>
        <LayoutHeader isMobile={isMobile} isTablet={isTablet} />
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
