import { Layout } from 'antd'
import Action from './Action'
import HeaderActionBlock from './ActionBlock'

const { Header } = Layout

interface HeaderProps {
  isMobile: boolean
  isTablet: boolean
  onOpenMobileMenu: () => void
}

export default function LayoutHeader({ isMobile, isTablet, onOpenMobileMenu }: HeaderProps) {
  return (
    <>
      <Header
        style={{ background: 'var(--app-surface-color)' }}
        className="h-44px flex items-center space-between px-4px"
      >
        <div className="flex-1">
          {isMobile ? (
            <HeaderActionBlock
              onClick={onOpenMobileMenu}
              title={t('导航栏')}
              icon="layout-fold"
              size={15}
            />
          ) : (
            <span />
          )}
        </div>
        <Action isMobile={isMobile} isTablet={isTablet} />
      </Header>
    </>
  )
}
