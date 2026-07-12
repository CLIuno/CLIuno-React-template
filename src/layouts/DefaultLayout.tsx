import { Icon } from '@iconify/react'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/ThemeToggle'

export default function DefaultLayout() {
  const { user, logout } = useAuthStore()

  return (
    <div className="tw:min-h-screen tw:flex tw:flex-col tw:bg-base-200">
      {/* App Navbar */}
      <header className="tw:bg-base-100 tw:shadow-sm tw:sticky tw:top-0 tw:z-50">
        <nav className="tw:container tw:mx-auto tw:flex tw:items-center tw:justify-between tw:px-4 tw:py-3">
          {/* Logo */}
          <Link to="/todos" className="tw:flex tw:items-center tw:gap-2">
            <Icon icon="mdi:rocket-launch-outline" className="tw:w-6 tw:h-6 tw:text-primary" />
            <span className="tw:text-xl tw:font-bold tw:text-primary">CLIuno</span>
          </Link>

          {/* Nav Links */}
          <div className="tw:flex tw:items-center tw:gap-1">
            <NavLink
              to="/todos"
              className={({ isActive }) =>
                `tw:btn tw:btn-ghost tw:btn-sm ${isActive ? 'tw:btn-active' : ''}`
              }
            >
              <Icon icon="mdi:clipboard-check-outline" className="tw:w-5 tw:h-5" />
              <span className="tw:hidden sm:tw:inline">Todos</span>
            </NavLink>
            <NavLink
              to="/posts"
              className={({ isActive }) =>
                `tw:btn tw:btn-ghost tw:btn-sm ${isActive ? 'tw:btn-active' : ''}`
              }
            >
              <Icon icon="mdi:post-outline" className="tw:w-5 tw:h-5" />
              <span className="tw:hidden sm:tw:inline">Posts</span>
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `tw:btn tw:btn-ghost tw:btn-sm ${isActive ? 'tw:btn-active' : ''}`
              }
            >
              <Icon icon="mdi:account-group-outline" className="tw:w-5 tw:h-5" />
              <span className="tw:hidden sm:tw:inline">Users</span>
            </NavLink>

            {/* Theme Toggle */}
            <div className="tw:ml-1">
              <ThemeToggle />
            </div>

            {/* User Menu */}
            <div className="tw:dropdown tw:dropdown-end">
              <button className="tw:btn tw:btn-ghost tw:btn-sm">
                <div className="tw:avatar tw:placeholder">
                  <div className="tw:bg-primary tw:text-primary-content tw:w-7 tw:h-7 tw:rounded-full">
                    <span className="tw:text-xs">
                      {user?.first_name?.[0] || '?'}
                      {user?.last_name?.[0] || ''}
                    </span>
                  </div>
                </div>
                <span className="tw:hidden sm:tw:inline tw:ml-1">{user?.username}</span>
                <Icon icon="mdi:chevron-down" className="tw:w-4 tw:h-4" />
              </button>
              <ul className="tw:dropdown-content tw:menu tw:p-2 tw:shadow-lg tw:bg-base-100 tw:rounded-box tw:w-52 tw:z-10">
                <li>
                  {user && (
                    <Link to={`/users/${user.id}`}>
                      <Icon icon="mdi:account" className="tw:w-4 tw:h-4" /> My Profile
                    </Link>
                  )}
                </li>
                <li>
                  <button onClick={() => logout()} className="tw:text-error">
                    <Icon icon="mdi:logout" className="tw:w-4 tw:h-4" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="tw:flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="tw:py-4 tw:text-center tw:text-sm tw:text-base-content/50">
        &copy; {new Date().getFullYear()} CLIuno — Built with React
      </footer>
    </div>
  )
}
