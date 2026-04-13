import { Layout } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'
import LayoutSider from './components/LayoutSider'
import LayoutHeader from './components/LayoutHeader'
import { useResize } from './useResize'
import { useI18nRefresh } from '@/utils/lang/t'
import { updateDocumentTitle } from '@/router/guard'

const { Content } = Layout

function AppLayout() {
  const currentLang = useI18nRefresh()
  const location = useLocation()
  const {
    // 是否为手机端（小屏），用于切换为抽屉导航
    isMobile,
    // 是否为平板端（中屏），用于调整侧边栏宽度等布局细节
    isTablet,
    // 侧边栏当前是否折叠
    collapse,
    // 切换侧边栏折叠/展开
    onToggleCollapse,
    // 移动端菜单抽屉是否打开
    mobileMenuOpen,
    // 打开移动端菜单抽屉
    onOpenMobileMenu,
    // 关闭移动端菜单抽屉
    onCloseMobileMenu,
  } = useResize()

  useEffect(() => {
    updateDocumentTitle(location.pathname)
  }, [currentLang, location.pathname])

  return (
    // 外层 Layout 负责整体骨架：左侧菜单 + 右侧主区域
    <Layout className="h-full">
      <LayoutSider
        collapse={collapse}
        onToggleCollapse={onToggleCollapse}
        isMobile={isMobile}
        isTablet={isTablet}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={onCloseMobileMenu}
      />
      <Layout>
        {/* Header 负责顶部操作区与移动端菜单触发 */}
        <LayoutHeader isMobile={isMobile} isTablet={isTablet} onOpenMobileMenu={onOpenMobileMenu} />
        {/* Outlet 渲染当前路由页面内容 */}
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
