import { Icon } from '@iconify/react'
import { useAuthStore } from '@/stores/auth'

export default function RegisterView() {
  const navigate = useNavigate()
  const { loading, error, register } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  })

  const passwordsMatch = form.password === form.password_confirmation
  const isFormValid =
    form.first_name &&
    form.last_name &&
    form.username &&
    form.email &&
    form.phone &&
    form.password.length >= 8 &&
    passwordsMatch

  function updateForm(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleRegister(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!isFormValid) return
    try {
      await register(form)
      navigate('/login')
    } catch {
      // error handled in store
    }
  }

  return (
    <div className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-base-200 tw:px-4 tw:py-8">
      <div className="tw:card tw:w-full tw:max-w-lg tw:bg-base-100 tw:shadow-xl">
        <div className="tw:card-body tw:p-8">
          {/* Logo */}
          <div className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:mb-2">
            <Icon icon="mdi:rocket-launch-outline" className="tw:w-8 tw:h-8 tw:text-primary" />
            <span className="tw:text-2xl tw:font-bold tw:text-primary">CLIuno</span>
          </div>

          <h2 className="tw:text-2xl tw:font-bold tw:text-center tw:mb-1">Create Account</h2>
          <p className="tw:text-center tw:text-base-content/60 tw:mb-6">Join the community</p>

          {/* Error Alert */}
          {error && (
            <div className="tw:alert tw:alert-error tw:mb-4">
              <Icon icon="mdi:alert-circle" className="tw:w-5 tw:h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="tw:space-y-4">
            {/* Name Row */}
            <div className="tw:grid tw:grid-cols-2 tw:gap-4">
              <fieldset className="tw:fieldset">
                <legend className="tw:fieldset-legend">First Name</legend>
                <input
                  value={form.first_name}
                  onChange={(e) => updateForm('first_name', e.target.value)}
                  type="text"
                  placeholder="John"
                  className="tw:input tw:w-full"
                  required
                />
              </fieldset>
              <fieldset className="tw:fieldset">
                <legend className="tw:fieldset-legend">Last Name</legend>
                <input
                  value={form.last_name}
                  onChange={(e) => updateForm('last_name', e.target.value)}
                  type="text"
                  placeholder="Doe"
                  className="tw:input tw:w-full"
                  required
                />
              </fieldset>
            </div>

            {/* Username */}
            <fieldset className="tw:fieldset">
              <legend className="tw:fieldset-legend">Username</legend>
              <label className="tw:input tw:w-full">
                <Icon icon="mdi:at" className="tw:h-[1em] tw:opacity-50" />
                <input
                  value={form.username}
                  onChange={(e) => updateForm('username', e.target.value)}
                  type="text"
                  placeholder="johndoe"
                  className="tw:grow"
                  required
                />
              </label>
            </fieldset>

            {/* Email */}
            <fieldset className="tw:fieldset">
              <legend className="tw:fieldset-legend">Email</legend>
              <label className="tw:input tw:w-full">
                <Icon icon="mdi:email-outline" className="tw:h-[1em] tw:opacity-50" />
                <input
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  type="email"
                  placeholder="john@example.com"
                  className="tw:grow"
                  required
                />
              </label>
            </fieldset>

            {/* Phone */}
            <fieldset className="tw:fieldset">
              <legend className="tw:fieldset-legend">Phone</legend>
              <label className="tw:input tw:w-full">
                <Icon icon="mdi:phone-outline" className="tw:h-[1em] tw:opacity-50" />
                <input
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  type="tel"
                  placeholder="+966512345678"
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
                  value={form.password}
                  onChange={(e) => updateForm('password', e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  className="tw:grow"
                  required
                  minLength={8}
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

            {/* Confirm Password */}
            <fieldset className="tw:fieldset">
              <legend className="tw:fieldset-legend">Confirm Password</legend>
              <label
                className={`tw:input tw:w-full ${form.password_confirmation && !passwordsMatch ? 'tw:input-error' : ''}`}
              >
                <Icon icon="mdi:lock-check-outline" className="tw:h-[1em] tw:opacity-50" />
                <input
                  value={form.password_confirmation}
                  onChange={(e) => updateForm('password_confirmation', e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className="tw:grow"
                  required
                />
              </label>
              {form.password_confirmation && !passwordsMatch && (
                <p className="tw:label tw:text-error">Passwords do not match</p>
              )}
            </fieldset>

            {/* Submit */}
            <button
              type="submit"
              className={`tw:btn tw:btn-primary tw:w-full ${loading ? 'tw:loading' : ''}`}
              disabled={loading || !isFormValid}
            >
              {!loading && <Icon icon="mdi:account-plus-outline" className="tw:w-5 tw:h-5" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="tw:divider tw:text-sm">Already have an account?</div>

          {/* Login Link */}
          <Link to="/login" className="tw:btn tw:btn-outline tw:w-full">
            <Icon icon="mdi:login" className="tw:w-5 tw:h-5" />
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
