import { AlertCircleIcon, EyeIcon, EyeOffIcon, Loader2Icon, RocketIcon } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 py-10 text-foreground">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 font-semibold">
        <RocketIcon className="size-5" />
        <span className="text-lg tracking-tight">CLIuno</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Account</CardTitle>
          <CardDescription>Join the community</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={form.first_name}
                  onChange={(e) => updateForm('first_name', e.target.value)}
                  type="text"
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={form.last_name}
                  onChange={(e) => updateForm('last_name', e.target.value)}
                  type="text"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => updateForm('username', e.target.value)}
                type="text"
                placeholder="johndoe"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={form.email}
                onChange={(e) => updateForm('email', e.target.value)}
                type="email"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => updateForm('phone', e.target.value)}
                type="tel"
                placeholder="+966512345678"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  value={form.password}
                  onChange={(e) => updateForm('password', e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  className="pr-9"
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </Button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <Input
                id="password_confirmation"
                value={form.password_confirmation}
                onChange={(e) => updateForm('password_confirmation', e.target.value)}
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                aria-invalid={Boolean(form.password_confirmation && !passwordsMatch)}
                required
              />
              {form.password_confirmation && !passwordsMatch && (
                <p className="text-sm text-destructive">Passwords do not match</p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading || !isFormValid}>
              {loading && <Loader2Icon className="animate-spin" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
