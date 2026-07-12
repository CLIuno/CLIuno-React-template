import { Icon } from '@iconify/react'
import api from '@/apis'

export default function ForgotPasswordView() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.auth.forgotPassword(email)
      setSuccess(true)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setError(axiosErr.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-base-200 tw:px-4">
      <div className="tw:card tw:w-full tw:max-w-md tw:bg-base-100 tw:shadow-xl">
        <div className="tw:card-body tw:p-8">
          <div className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:mb-2">
            <Icon icon="mdi:rocket-launch-outline" className="tw:w-8 tw:h-8 tw:text-primary" />
            <span className="tw:text-2xl tw:font-bold tw:text-primary">CLIuno</span>
          </div>

          <h2 className="tw:text-2xl tw:font-bold tw:text-center tw:mb-1">Forgot Password</h2>
          <p className="tw:text-center tw:text-base-content/60 tw:mb-6">
            Enter your email to receive a reset link
          </p>

          {success && (
            <div className="tw:alert tw:alert-success tw:mb-4">
              <Icon icon="mdi:check-circle" className="tw:w-5 tw:h-5" />
              <span>Reset link sent! Check your email.</span>
            </div>
          )}

          {error && (
            <div className="tw:alert tw:alert-error tw:mb-4">
              <Icon icon="mdi:alert-circle" className="tw:w-5 tw:h-5" />
              <span>{error}</span>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="tw:space-y-4">
              <fieldset className="tw:fieldset">
                <legend className="tw:fieldset-legend">Email Address</legend>
                <label className="tw:input tw:w-full">
                  <Icon icon="mdi:email-outline" className="tw:h-[1em] tw:opacity-50" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Enter your email"
                    className="tw:grow"
                    required
                  />
                </label>
              </fieldset>

              <button type="submit" className="tw:btn tw:btn-primary tw:w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="tw:text-center tw:mt-4">
            <Link to="/login" className="tw:link tw:link-primary">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
