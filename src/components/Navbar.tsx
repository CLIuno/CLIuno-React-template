import { ChevronDownIcon, LogOutIcon, RocketIcon, UserIcon } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/ThemeToggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Todos', to: '/todos' },
  { label: 'Posts', to: '/posts' },
  { label: 'Users', to: '/users' },
]

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <nav className="container mx-auto flex h-14 items-center gap-4 px-4 sm:gap-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <RocketIcon className="size-5" />
          <span className="hidden text-lg tracking-tight sm:inline">CLIuno</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-4 sm:gap-5">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors hover:text-foreground',
                  isActive ? 'text-foreground' : 'text-muted-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="sm" className="gap-2 pl-1.5" />}
              >
                <Avatar size="sm">
                  {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user.username} />}
                  <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{user?.username}</span>
                <ChevronDownIcon className="text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user && (
                  <>
                    <DropdownMenuLabel>
                      {user.first_name} {user.last_name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem render={<Link to={`/users/${user.id}`} />}>
                      <UserIcon />
                      Profile
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem variant="destructive" onClick={() => logout()}>
                  <LogOutIcon />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" render={<Link to="/login" />}>
                Login
              </Button>
              <Button size="sm" render={<Link to="/register" />}>
                Register
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
