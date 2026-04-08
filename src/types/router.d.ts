import type { ComponentType, ReactElement } from 'react'
import { type RouteObject } from 'react-router-dom'

declare global {
  namespace Router {
    type RouteQueryValue = string | number | boolean | null | undefined
    type RouteQuery = Record<string, RouteQueryValue>

    type RouteComponent =
      | ComponentType
      | (() => ReactElement)
      | (() => Promise<{ default: ComponentType }>)

    /** 路由扩展元信息 */
    interface RouteMeta {
      /** 需要高亮的菜单路径 */
      activeMenu?: string
      /** 是否隐藏面包屑 */
      breadcrumbHidden?: boolean
      /** 是否显示小圆点 */
      dot?: boolean
      /** 动态传参路由是否在新标签页打开 */
      dynamicNewTab?: boolean
      /** 路由权限标识 */
      guard?: string[]
      /** 是否在菜单中隐藏当前路由，默认 false */
      hidden?: boolean
      /** 菜单图标名 */
      icon?: string
      /** 是否使用自定义 svg 图标，默认 false */
      isCustomSvg?: boolean
      /** 是否隐藏一级菜单，默认 true */
      levelHidden?: boolean
      /** 是否禁止关闭当前标签页 */
      noClosable?: boolean
      /** 是否隐藏侧边栏 */
      noColumn?: boolean
      /** 是否禁用页面缓存，默认 false */
      noKeepAlive?: boolean
      /** 是否在多标签页中隐藏 */
      tabHidden?: boolean
      /** 链接打开方式 */
      target?: '_blank' | false
      /** 菜单、面包屑、多标签页展示名 */
      title?: string
      /** 二级路由是否没有子级 */
      isLevel2?: boolean
      /** 是否是一级路由 */
      isLevel1?: boolean
      /** 菜单折叠后显示名称 */
      subTitle?: string
      /** 是否禁用页面 padding */
      noPadding?: boolean
      /** 是否启用页面缓存关联配置 */
      isCache?: boolean
      /** microApp 子应用名称 */
      microAppName?: string
      /** 外链地址 */
      href?: string
    }

    /** 项目内部路由结构 */
    interface RouteRecord extends RouteObject {
      /** 路由路径 */
      path?: string
      /** 是否为索引路由 */
      index?: boolean
      /** 路由唯一名称 */
      name: string
      /** 路由扩展元信息 */
      meta: RouteMeta
      children?: RouteRecord[]
      /** 所有子节点 path 列表 */
      childrenPathList?: string[]
      /** 继承的父级菜单图标 */
      parentIcon?: string
      redirect?: string
      /** 是否在菜单中隐藏 */
      isHidden?: boolean
      /** 路由 query 参数 */
      query?: RouteQuery
      /** 动态组件定义 */
      component?: RouteComponent
      /** 渲染元素 */
      element?: RouteObject['element']
      /** 懒加载路由定义 */
      lazy?: RouteObject['lazy']
      /** 路由类型扩展字段 */
      type?: number
    }
  }
}
