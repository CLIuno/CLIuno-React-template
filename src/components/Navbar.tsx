import { Icon } from '@iconify/react'
import ThemeToggle from '@/components/ThemeToggle'

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false)
  const isLoggedIn = !!localStorage.getItem('token')

  const navButtons = [
    { label: 'Docs', link: 'https://github.com/CLIuno', style: 'tw:btn-secondary' },
    { label: 'Donate', link: 'https://ko-fi.com/ru44y', style: 'tw:btn-accent' },
    { label: 'Star', link: 'https://github.com/CLIuno', style: 'tw:btn-info' },
  ]

  return (
    <header className="tw:bg-base-100 tw:shadow-sm tw:px-4 sm:tw:px-6 tw:py-3">
      <nav className="tw:flex tw:items-center tw:justify-between tw:container tw:mx-auto">
        {/* Logo */}
        <Link to="/" className="tw:flex tw:items-center tw:gap-2">
          <Icon icon="mdi:rocket-launch-outline" className="tw:w-6 tw:h-6 tw:text-primary" />
          <span className="tw:text-xl tw:font-bold tw:text-primary">CLIuno</span>
        </Link>

        {/* Desktop Buttons */}
        <div className="tw:hidden tw:md:flex tw:items-center">
          <ThemeToggle />

          {navButtons.map((btn) => (
            <a
              key={btn.label}
              href={btn.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`tw:btn tw:btn-sm tw:ml-2 ${btn.style}`}
            >
              {btn.label}
            </a>
          ))}

          {isLoggedIn ? (
            <Link to="/todos" className="tw:btn tw:btn-sm tw:btn-primary tw:ml-2">
              <Icon icon="mdi:clipboard-check-outline" className="tw:w-4 tw:h-4" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="tw:btn tw:btn-sm tw:btn-success tw:ml-2">
                Login
              </Link>
              <Link
                to="/register"
                className="tw:btn tw:btn-sm tw:btn-outline tw:btn-primary tw:ml-2"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="tw:p-2 tw:rounded-md hover:tw:bg-base-200 tw:transition-colors tw:md:hidden"
        >
          <Icon
            icon={showMenu ? 'mdi:close' : 'mdi:menu'}
            className="tw:w-6 tw:h-6 tw:text-base-content"
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className="tw:overflow-hidden tw:transition-all tw:duration-300 tw:ease-in-out tw:mx-auto tw:mt-1 tw:rounded-lg tw:bg-base-200 tw:shadow-md md:tw:hidden"
        style={{ maxHeight: showMenu ? '500px' : '0px' }}
      >
        <div className="tw:p-3">
          <ul className="tw:flex tw:flex-col tw:gap-2">
            {navButtons.map((btn) => (
              <li key={btn.label}>
                <a
                  href={btn.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tw:block tw:px-4 tw:py-2 tw:rounded-md tw:transition-colors hover:tw:bg-base-300"
                >
                  {btn.label}
                </a>
              </li>
            ))}
            {isLoggedIn ? (
              <li>
                <Link
                  to="/todos"
                  className="tw:block tw:px-4 tw:py-2 tw:bg-primary tw:text-white tw:rounded-md"
                >
                  Dashboard
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="tw:block tw:px-4 tw:py-2 tw:bg-success tw:text-white tw:rounded-md"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="tw:block tw:px-4 tw:py-2 tw:bg-primary/10 tw:text-primary tw:rounded-md"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
            <li>
              <div className="tw:flex tw:items-center tw:gap-2 tw:px-4 tw:py-2 tw:rounded-md hover:tw:bg-base-300">
                <ThemeToggle />
                Toggle Theme
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
