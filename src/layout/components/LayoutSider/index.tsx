import Logo from './Logo'
import Menu from './Menu'
import Collapse from './Collapse'

export default function LayoutSider() {
  return (
    <div className="layout-sider flex h-full flex-col">
      <Logo />
      <Menu />
      <Collapse />
    </div>
  )
}
