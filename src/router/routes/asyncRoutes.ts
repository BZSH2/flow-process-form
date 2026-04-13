import { createElement } from 'react'
import { Navigate } from 'react-router-dom'

const asyncRoutes: Router.RouteRecord[] = [
  {
    path: '/',
    name: 'layout',
    meta: {
      levelHidden: true,
    },
    lazy: async () => ({ Component: (await import('../../layout')).default }),
    children: [
      {
        index: true,
        name: 'root-redirect',
        meta: {
          hidden: true,
          breadcrumbHidden: true,
        },
        element: createElement(Navigate, { to: '/dashboard', replace: true }),
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
          title: '首页',
          icon: 'menus-whiteCat',
          activeMenu: 'dashboard',
        },
        lazy: async () => ({ Component: (await import('@/views/dashboard')).default }),
      },
      {
        path: 'system',
        name: 'system',
        meta: {
          title: '系统管理',
          icon: 'menus-blackCat',
          activeMenu: 'system',
        },
        lazy: async () => ({ Component: (await import('@/views/system')).default }),
        children: [
          {
            index: true,
            name: 'system-redirect',
            meta: {
              hidden: true,
              breadcrumbHidden: true,
            },
            element: createElement(Navigate, { to: 'user', replace: true }),
          },
          {
            path: 'user',
            name: 'system-user',
            meta: {
              title: '用户管理',
              activeMenu: 'system',
            },
            lazy: async () => ({ Component: (await import('@/views/system/user')).default }),
          },
          {
            path: 'role',
            name: 'system-role',
            meta: {
              title: '角色管理',
              activeMenu: 'system',
            },
            lazy: async () => ({ Component: (await import('@/views/system/role')).default }),
          },
        ],
      },
      {
        path: 'process',
        name: 'process',
        meta: {
          title: '流程图',
          icon: 'menus-borderCollie',
          activeMenu: 'process',
        },
        lazy: async () => ({ Component: (await import('@/views/process')).default }),
      },
    ],
  },
]

export default asyncRoutes
