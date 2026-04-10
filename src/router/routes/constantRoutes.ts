import { createElement } from 'react'
import { Navigate } from 'react-router-dom'

const constantRoutes: Router.RouteRecord[] = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hidden: true,
      breadcrumbHidden: true,
    },
    lazy: async () => ({ Component: (await import('@/views/login')).default }),
  },

  {
    path: '*',
    name: 'not-found',
    meta: {
      hidden: true,
      breadcrumbHidden: true,
    },
    element: createElement(Navigate, { to: '/dashboard', replace: true }),
  },
]

export default constantRoutes
