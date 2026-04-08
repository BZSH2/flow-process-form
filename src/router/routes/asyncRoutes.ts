import { createElement } from 'react'
import { Navigate } from 'react-router-dom'

const asyncRoutes: Router.RouteRecord[] = [
  {
    path: '/',
    name: 'layout',
    meta: {
      title: '首页',
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
          title: 'Dashboard',
          activeMenu: 'dashboard',
        },
        lazy: async () => ({ Component: (await import('../../views/dashboard')).default }),
      },
      {
        path: 'system',
        name: 'system',
        meta: {
          title: 'System',
          activeMenu: 'system',
        },
        lazy: async () => ({ Component: (await import('../../views/system')).default }),
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
              title: 'User',
              activeMenu: 'system',
            },
            lazy: async () => ({ Component: (await import('../../views/system/user')).default }),
          },
          {
            path: 'role',
            name: 'system-role',
            meta: {
              title: 'Role',
              activeMenu: 'system',
            },
            lazy: async () => ({ Component: (await import('../../views/system/role')).default }),
          },
        ],
      },
    ],
  },
]

export default asyncRoutes
