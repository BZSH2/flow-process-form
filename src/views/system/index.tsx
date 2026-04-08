import { NavLink, Outlet } from 'react-router-dom'

function SystemView() {
  return (
    <section>
      <h2>System</h2>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <NavLink to="user">User</NavLink>
        <NavLink to="role">Role</NavLink>
      </nav>
      <Outlet />
    </section>
  )
}

export default SystemView
