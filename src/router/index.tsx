import { Loader2Icon } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/layouts/DefaultLayout'

const HomeView = lazy(() => import('@/views/HomeView'))
const LoginView = lazy(() => import('@/views/auth/LoginView'))
const RegisterView = lazy(() => import('@/views/auth/RegisterView'))
const ForgotPasswordView = lazy(() => import('@/views/auth/ForgotPasswordView'))
const TodosView = lazy(() => import('@/views/app/TodosView'))
const TodoDetailView = lazy(() => import('@/views/app/TodoDetailView'))
const PostsView = lazy(() => import('@/views/app/PostsView'))
const PostDetailView = lazy(() => import('@/views/app/PostDetailView'))
const UsersView = lazy(() => import('@/views/app/UsersView'))
const UserProfileView = lazy(() => import('@/views/user-profile/UserProfileView'))

function GuestRoute({ children }: Readonly<{ children: React.ReactNode }>) {
  const token = localStorage.getItem('token')
  if (token) return <Navigate to="/todos" replace />
  return <>{children}</>
}

function ProtectedRoute({ children }: Readonly<{ children: React.ReactNode }>) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function AppRouter() {
  const { token, fetchCurrentUser } = useAuthStore()

  useEffect(() => {
    if (token) {
      fetchCurrentUser()
    }
  }, [token, fetchCurrentUser])

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginView />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterView />
              </GuestRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestRoute>
                <ForgotPasswordView />
              </GuestRoute>
            }
          />
          <Route
            element={
              <ProtectedRoute>
                <DefaultLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/todos" element={<TodosView />} />
            <Route path="/todos/:id" element={<TodoDetailView />} />
            <Route path="/posts" element={<PostsView />} />
            <Route path="/posts/:id" element={<PostDetailView />} />
            <Route path="/users" element={<UsersView />} />
            <Route path="/users/:id" element={<UserProfileView />} />
            <Route path="/profile" element={<UserProfileView />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
