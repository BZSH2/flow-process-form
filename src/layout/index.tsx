import { NavLink, Outlet } from 'react-router-dom'

function AppLayout() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Flow Process Form</h1>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <NavLink style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} to="/dashboard">
          <Icon name="menus-corgi" />
          Dashboard
        </NavLink>
        <NavLink style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} to="/system/user">
          <Icon name="menus-hamster" />
          User
        </NavLink>
        <NavLink style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} to="/system/role">
          <Icon name="menus-husky" />
          Role
        </NavLink>
        <NavLink style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} to="/login">
          <Icon name="menus-psyduck" />
          Login
        </NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
