import { useState } from 'react'
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

function mapRoutesToMenus(routes: Router.RouteRecord[]): MenuItem[] {
  return routes
    .filter((r) => !r.meta?.hidden)
    .flatMap((route) => {
      const children = (route.children ?? []).filter((r) => !r.meta?.hidden)
      if (route.meta?.levelHidden) {
        return mapRoutesToMenus(children)
      }
      const item: MenuItem = {
        key: route.path ?? '',
        label: route.meta?.title,
        icon: route.meta?.icon ? <Icon name={route.meta.icon} /> : undefined,
      }
      const mappedChildren = mapRoutesToMenus(children)
      if (mappedChildren.length > 0) {
        return [{ ...item, children: mappedChildren }]
      }
      return [item]
    })
}

export default function LayoutMenu({ collapse, isMobile, onMenuItemClick }: LayoutMenuProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [openKeys, setOpenKeys] = useState<string[]>([])

  const routes = router.routes as unknown as Router.RouteRecord[]
  const menuItems = mapRoutesToMenus(routes)

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.keyPath.reverse().join('/'))
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
      className="border-none flex-1"
    />
  )
}
