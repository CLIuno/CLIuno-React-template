import { Icon } from '@iconify/react'
import { useAuthStore } from '@/stores/auth'

export default function LoginView() {
  const navigate = useNavigate()
  const { loading, error, login } = useAuthStore()
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleLogin(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!usernameOrEmail || !password) return
    try {
      await login(usernameOrEmail, password)
      navigate('/todos')
    } catch {
      // error handled in store
    }
  }

  return (
    <div className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-base-200 tw:px-4">
      <div className="tw:card tw:w-full tw:max-w-md tw:bg-base-100 tw:shadow-xl">
        <div className="tw:card-body tw:p-8">
          {/* Logo */}
          <div className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:mb-2">
            <Icon icon="mdi:rocket-launch-outline" className="tw:w-8 tw:h-8 tw:text-primary" />
            <span className="tw:text-2xl tw:font-bold tw:text-primary">CLIuno</span>
          </div>

          <h2 className="tw:text-2xl tw:font-bold tw:text-center tw:mb-1">Welcome back</h2>
          <p className="tw:text-center tw:text-base-content/60 tw:mb-6">Sign in to your account</p>

          {/* Error Alert */}
          {error && (
            <div className="tw:alert tw:alert-error tw:mb-4">
              <Icon icon="mdi:alert-circle" className="tw:w-5 tw:h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="tw:space-y-4">
            {/* Email/Username */}
            <fieldset className="tw:fieldset">
              <legend className="tw:fieldset-legend">Email or Username</legend>
              <label className="tw:input tw:w-full">
                <Icon icon="mdi:account-outline" className="tw:h-[1em] tw:opacity-50" />
                <input
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  type="text"
                  placeholder="Enter your email or username"
                  className="tw:grow"
                  required
                />
              </label>
            </fieldset>

            {/* Password */}
            <fieldset className="tw:fieldset">
              <legend className="tw:fieldset-legend">Password</legend>
              <label className="tw:input tw:w-full">
                <Icon icon="mdi:lock-outline" className="tw:h-[1em] tw:opacity-50" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="tw:grow"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="tw:btn tw:btn-ghost tw:btn-xs tw:btn-circle"
                >
                  <Icon icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} className="tw:w-4 tw:h-4" />
                </button>
              </label>
            </fieldset>

            {/* Forgot Password */}
            <div className="tw:flex tw:justify-end">
              <Link to="/forgot-password" className="tw:link tw:link-primary tw:text-sm">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`tw:btn tw:btn-primary tw:w-full ${loading ? 'tw:loading' : ''}`}
              disabled={loading}
            >
              {!loading && <Icon icon="mdi:login" className="tw:w-5 tw:h-5" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="tw:divider tw:text-sm">Don't have an account?</div>

          {/* Register Link */}
          <Link to="/register" className="tw:btn tw:btn-outline tw:btn-secondary tw:w-full">
            <Icon icon="mdi:account-plus-outline" className="tw:w-5 tw:h-5" />
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}
