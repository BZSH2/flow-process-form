import { Layout } from 'antd'

const { Header } = Layout

interface HeaderProps {
  isMobile: boolean
  isTablet: boolean
}

export default function LayoutHeader({ isMobile, isTablet }: HeaderProps) {
  return (
    <>
      <Header
        style={{ background: '#fff' }}
        className="h-44px flex items-center space-between px-12px"
      >
        <div className="flex-1"> {isMobile ? <Icon name="layout-fold" /> : <p>111</p>}</div>
        <div>{isTablet ? 'tablet' : 'pc'}</div>
      </Header>
    </>
  )
}
