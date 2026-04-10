import { useEffect, useState } from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import Icon from '@/icons'
import router from '@/router'

type MenuItem = Required<MenuProps>['items'][number]
interface LayoutMenuProps {
  collapse: boolean
  isMobile: boolean
  /** 移动端点击菜单后用于关闭抽屉 */
  onMenuItemClick?: () => void
}

// 将路由 path 统一转换为可直接匹配 location.pathname 的绝对路径
function resolveMenuPath(routePath: string | undefined, parentPath: string) {
  if (!routePath) {
    return parentPath || '/'
  }
  if (routePath.startsWith('/')) {
    return routePath
  }
  if (!parentPath || parentPath === '/') {
    return `/${routePath}`
  }
  return `${parentPath}/${routePath}`
}

// 递归把路由树转换为 antd Menu 配置，并确保每个 key 都是绝对路径
function mapRoutesToMenus(routes: Router.RouteRecord[], parentPath = ''): MenuItem[] {
  return routes
    .filter((r) => !r.meta?.hidden)
    .flatMap((route) => {
      const children = (route.children ?? []).filter((r) => !r.meta?.hidden)
      if (route.meta?.levelHidden) {
        return mapRoutesToMenus(
          children,
          route.path ? resolveMenuPath(route.path, parentPath) : parentPath
        )
      }
      const routePath = resolveMenuPath(route.path, parentPath)
      const item: MenuItem = {
        key: routePath,
        label: t(route.meta.title),
        icon: route.meta?.icon ? <Icon name={route.meta.icon} /> : undefined,
      }
      const mappedChildren = mapRoutesToMenus(children, routePath)
      if (mappedChildren.length > 0) {
        return [{ ...item, children: mappedChildren }]
      }
      return [item]
    })
}

// 由当前 pathname 推导需要默认展开的父级菜单 key（如 /system/user -> ['/system']）
function getParentMenuKeys(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  return segments.slice(0, -1).map((_, index) => `/${segments.slice(0, index + 1).join('/')}`)
}

export default function LayoutMenu({ collapse, isMobile, onMenuItemClick }: LayoutMenuProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [openKeys, setOpenKeys] = useState<string[]>([])

  const routes = router.routes as unknown as Router.RouteRecord[]
  const menuItems = mapRoutesToMenus(routes)

  // 路由变化时同步展开项，保证刷新或地址栏直达时菜单状态正确
  useEffect(() => {
    setOpenKeys(getParentMenuKeys(pathname))
  }, [pathname])

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(String(e.key))
    onMenuItemClick?.()
  }

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    setOpenKeys(keys as string[])
  }

  // 桌面端折叠时由 antd 内部处理悬浮子菜单，移动端保持普通展开逻辑
  const mergedOpenKeys = !isMobile && collapse ? undefined : openKeys

  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname]}
      openKeys={mergedOpenKeys}
      inlineCollapsed={!isMobile && collapse}
      items={menuItems}
      onClick={onClick}
      onOpenChange={onOpenChange}
      className="border-none flex-1 border-inline-end-none"
    />
  )
}
