import {
  matchPath,
  matchRoutes,
  redirect,
  type LoaderFunctionArgs,
  type RouteObject,
} from 'react-router-dom'
import { getAccessToken } from '@/utils/auth'
import { settingConfig } from '@/config/setting.config'
import constantRoutes from './routes/constantRoutes'
import asyncRoutes from './routes/asyncRoutes'
import { t } from '@/utils/lang/t'

const LOGIN_PATH = '/login'
const HOME_PATH = '/dashboard'
const WHITE_LIST = [LOGIN_PATH]
const TITLE_ROUTES = [...constantRoutes, ...asyncRoutes] as RouteObject[]

function isAuthenticated() {
  return Boolean(getAccessToken())
}

function isWhiteRoute(pathname: string) {
  return WHITE_LIST.some((path) => matchPath({ path, end: false }, pathname))
}

function resolveRedirectPath(rawRedirectPath: string | null) {
  if (!rawRedirectPath) {
    return HOME_PATH
  }
  const decodedPath = decodeURIComponent(rawRedirectPath)
  if (decodedPath.startsWith('/')) {
    return decodedPath
  }
  return HOME_PATH
}

export function updateDocumentTitle(pathname: string) {
  if (typeof document === 'undefined') {
    return
  }
  const matches = matchRoutes(TITLE_ROUTES, pathname)
  const matchedRoute = matches
    ? [...matches].reverse().find((item) => (item.route as Router.RouteRecord).meta?.title)
    : null
  const routeTitle = (matchedRoute?.route as Router.RouteRecord | undefined)?.meta?.title
  const appTitle = settingConfig.title
  document.title = routeTitle ? `${t(routeTitle)} - ${appTitle}` : appTitle
}

export function routeGuardLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const pathname = url.pathname
  const authed = isAuthenticated()
  const whiteRoute = isWhiteRoute(pathname)

  if (!authed && !whiteRoute) {
    const redirectPath = `${pathname}${url.search}`
    throw redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(redirectPath)}`)
  }

  if (authed && pathname === LOGIN_PATH) {
    const targetPath = resolveRedirectPath(url.searchParams.get('redirect'))
    throw redirect(targetPath)
  }

  updateDocumentTitle(pathname)
  return null
}
