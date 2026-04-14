import { useEffect, useState } from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import Icon from '@/icons'
import router from '@/router'
import { useResolvedThemeMode } from '@/store'

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
        label: t(route.meta.title ?? ''),
        icon: route.meta?.icon ? <Icon name={route.meta.icon} /> : undefined,
      }
      const mappedChildren = mapRoutesToMenus(children, routePath)
      if (mappedChildren.length > 0) {
        return [{ ...item, children: mappedChildren }]
      }
      return [item]
    })
}

// 展平路由，建立 path -> routeMeta 的索引，便于根据当前路由读取 activeMenu
function collectRouteMetaByPath(
  routes: Router.RouteRecord[],
  parentPath = '',
  routeMetaByPath: Record<string, Router.RouteMeta | undefined> = {}
) {
  routes.forEach((route) => {
    const currentPath = route.index ? parentPath || '/' : resolveMenuPath(route.path, parentPath)
    routeMetaByPath[currentPath] = route.meta
    if (route.children?.length) {
      collectRouteMetaByPath(route.children, currentPath, routeMetaByPath)
    }
  })
  return routeMetaByPath
}

// 由当前 pathname 推导需要默认展开的父级菜单 key（如 /system/user -> ['/system']）
function getParentMenuKeys(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  return segments.slice(0, -1).map((_, index) => `/${segments.slice(0, index + 1).join('/')}`)
}

function resolveSelectedMenuKey(
  pathname: string,
  routeMetaByPath: Record<string, Router.RouteMeta | undefined>
) {
  const exactActiveMenu = routeMetaByPath[pathname]?.activeMenu
  if (exactActiveMenu) {
    return exactActiveMenu
  }

  // 对于非精确命中路径（如动态段/额外层级），按最长前缀回退：
  // 1) 优先使用前缀路由配置的 activeMenu
  // 2) 否则使用前缀路由自身 path
  const matchedPaths = Object.keys(routeMetaByPath)
    .filter((routePath) => routePath !== '/' && pathname.startsWith(`${routePath}/`))
    .sort((a, b) => b.length - a.length)

  for (const routePath of matchedPaths) {
    const activeMenu = routeMetaByPath[routePath]?.activeMenu
    if (activeMenu) {
      return activeMenu
    }
  }

  if (matchedPaths.length > 0) {
    return matchedPaths[0]
  }

  return pathname
}

export default function LayoutMenu({ collapse, isMobile, onMenuItemClick }: LayoutMenuProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const resolvedMode = useResolvedThemeMode()

  const routes = router.routes as unknown as Router.RouteRecord[]
  const menuItems = mapRoutesToMenus(routes)
  const routeMetaByPath = collectRouteMetaByPath(routes)
  const selectedMenuKey = resolveSelectedMenuKey(pathname, routeMetaByPath)

  // 路由变化时同步展开项，保证刷新或地址栏直达时菜单状态正确
  useEffect(() => {
    setOpenKeys(getParentMenuKeys(selectedMenuKey))
  }, [selectedMenuKey])

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
      theme={resolvedMode}
      mode="inline"
      selectedKeys={[selectedMenuKey]}
      openKeys={mergedOpenKeys}
      inlineCollapsed={!isMobile && collapse}
      items={menuItems}
      onClick={onClick}
      onOpenChange={onOpenChange}
      className="border-none flex-1 border-inline-end-none"
    />
  )
}
