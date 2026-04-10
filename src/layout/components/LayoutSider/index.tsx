import { Drawer, Layout } from 'antd'
import Logo from './Logo'
import Menu from './Menu'
import Collapse from './Collapse'

const { Sider } = Layout

interface SiderProps {
  collapse: boolean
  onToggleCollapse: () => void
  isMobile: boolean
  isTablet: boolean
  mobileMenuOpen: boolean
  onCloseMobileMenu: () => void
}

export default function LayoutSider({
  collapse,
  onToggleCollapse,
  isMobile,
  isTablet,
  mobileMenuOpen,
  onCloseMobileMenu,
}: SiderProps) {
  const siderCollapsed = isTablet ? true : collapse

  const renderSiderContent = (
    contentCollapse: boolean,
    contentIsMobile: boolean,
    menuItemClick?: () => void
  ) => {
    return (
      <div className="layout-sider flex h-full flex-col">
        <Logo collapse={contentCollapse} isMobile={contentIsMobile} />
        <Menu
          collapse={contentCollapse}
          isMobile={contentIsMobile}
          onMenuItemClick={menuItemClick}
        />
        {!contentIsMobile && !isTablet && (
          <Collapse collapse={contentCollapse} onToggleCollapse={onToggleCollapse} />
        )}
      </div>
    )
  }

  return (
    <>
      {!isMobile && (
        <Sider
          theme="light"
          style={{ background: '#fff' }}
          width={isTablet ? 200 : 220}
          collapsedWidth={64}
          collapsed={siderCollapsed}
        >
          {renderSiderContent(siderCollapsed, false)}
        </Sider>
      )}
      <Drawer
        placement="left"
        open={isMobile && mobileMenuOpen}
        onClose={onCloseMobileMenu}
        width={220}
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        {renderSiderContent(false, true, onCloseMobileMenu)}
      </Drawer>
    </>
  )
}
