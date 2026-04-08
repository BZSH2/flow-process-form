import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import constantRoutes from './routes/constantRoutes'
import asyncRoutes from './routes/asyncRoutes'

const router = createBrowserRouter([...constantRoutes, ...asyncRoutes] as RouteObject[])

export default router
