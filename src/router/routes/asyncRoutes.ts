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
          activeMenu: '/dashboard',
        },
        lazy: async () => ({ Component: (await import('@/views/dashboard')).default }),
      },
      {
        path: 'system',
        name: 'system',
        meta: {
          title: '系统管理',
          icon: 'menus-blackCat',
          activeMenu: '/system',
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
              activeMenu: '/system',
            },
            lazy: async () => ({ Component: (await import('@/views/system/user')).default }),
          },
          {
            path: 'role',
            name: 'system-role',
            meta: {
              title: '角色管理',
              activeMenu: '/system',
            },
            lazy: async () => ({ Component: (await import('@/views/system/role')).default }),
          },
        ],
      },
      {
        path: 'processList',
        name: 'processList',
        meta: {
          title: '流程图列表',
          icon: 'menus-sheep',
          activeMenu: '/process',
        },
        lazy: async () => ({ Component: (await import('@/views/processList')).default }),
      },
      {
        path: 'process',
        name: 'process',
        meta: {
          title: '流程图',
          icon: 'menus-borderCollie',
          activeMenu: '/processList',
        },
        lazy: async () => ({ Component: (await import('@/views/process')).default }),
      },
      {
        path: 'form',
        name: 'form',
        meta: {
          title: '表单管理',
          icon: 'menus-sphynxCat',
        },
        children: [
          {
            path: 'promotion',
            name: 'promotion',
            meta: {
              title: '促销表单',
              activeMenu: '/form',
            },
            lazy: async () => ({ Component: (await import('@/views/form/promotion')).default }),
          },
          {
            path: 'process',
            name: 'process',
            meta: {
              title: '流程表单',
              activeMenu: '/form',
            },
            lazy: async () => ({ Component: (await import('@/views/form/process')).default }),
          },
          {
            path: 'promotionCreate',
            name: 'promotionCreate',
            meta: {
              title: '促销表单-新建',
              activeMenu: '/form/promotion',
              hidden: true,
            },
            lazy: async () => ({
              Component: (await import('@/views/form/promotionCreate')).default,
            }),
          },
        ],
      },
    ],
  },
]

export default asyncRoutes
