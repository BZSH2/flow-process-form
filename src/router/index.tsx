import { createBrowserRouter, type LoaderFunctionArgs, type RouteObject } from 'react-router-dom'
import constantRoutes from './routes/constantRoutes'
import asyncRoutes from './routes/asyncRoutes'
import { routeGuardLoader } from './guard'

// 递归为所有路由注入统一守卫，并保留业务侧已有 loader
function injectRouteGuard(routes: Router.RouteRecord[]): Router.RouteRecord[] {
  return routes.map((route) => {
    const currentLoader = (
      route as RouteObject & { loader?: (args: LoaderFunctionArgs) => unknown }
    ).loader
    return {
      ...route,
      loader: async (args: LoaderFunctionArgs) => {
        await routeGuardLoader(args)
        if (currentLoader) {
          return currentLoader(args)
        }
        return null
      },
      children: route.children ? injectRouteGuard(route.children) : route.children,
    }
  })
}

const router = createBrowserRouter(
  injectRouteGuard([...constantRoutes, ...asyncRoutes] as Router.RouteRecord[]) as RouteObject[]
)

export default router
