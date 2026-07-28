import { Loader2Icon, UserCheckIcon, UserPlusIcon, UsersIcon } from 'lucide-react'
import api from '@/apis'
import { useAuthStore } from '@/stores/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface UserItem {
  id: string
  username: string
  avatar_url?: string | null
  first_name: string
  last_name: string
  email: string
}

export default function UsersView() {
  const { user: currentUser } = useAuthStore()
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({})
  const [togglingFollow, setTogglingFollow] = useState<Record<string, boolean>>({})

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.user.getUsers()
      const allUsers: UserItem[] = res.data.data.users
      const others = allUsers.filter((u) => u.id !== currentUser?.id)
      setUsers(others)

      const map: Record<string, boolean> = {}
      await Promise.all(
        others.map(async (u) => {
          try {
            const r = await api.follow.isFollowing(u.id)
            map[u.id] = r.data.data.isFollowing
          } catch {
            map[u.id] = false
          }
        }),
      )
      setFollowingMap(map)
    } catch {
      // handle
    } finally {
      setLoading(false)
    }
  }, [currentUser?.id])

  async function toggleFollow(userId: string) {
    setTogglingFollow((prev) => ({ ...prev, [userId]: true }))
    try {
      if (followingMap[userId]) {
        await api.follow.unfollow(userId)
        setFollowingMap((prev) => ({ ...prev, [userId]: false }))
      } else {
        await api.follow.follow(userId)
        setFollowingMap((prev) => ({ ...prev, [userId]: true }))
      }
    } catch {
      // handle
    } finally {
      setTogglingFollow((prev) => ({ ...prev, [userId]: false }))
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Discover and follow other users</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty State */}
      {!loading && users.length === 0 && (
        <div className="py-20 text-center">
          <UsersIcon className="mx-auto size-14 text-muted-foreground/40" />
          <h3 className="mt-4 text-xl font-semibold">No other users yet</h3>
          <p className="mt-2 text-muted-foreground">Be the first to invite someone!</p>
        </div>
      )}

      {/* Users List */}
      {!loading && users.length > 0 && (
        <div className="space-y-3">
          {users.map((u) => (
            <Card key={u.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4">
                {/* Avatar */}
                <Avatar size="lg">
                  {u.avatar_url && <AvatarImage src={u.avatar_url} alt={u.username} />}
                  <AvatarFallback>
                    {u.first_name[0]}
                    {u.last_name[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <Link
                    to={`/users/${u.id}`}
                    className="font-semibold transition-colors hover:text-primary"
                  >
                    {u.first_name} {u.last_name}
                  </Link>
                  <p className="truncate text-sm text-muted-foreground">
                    @{u.username} · {u.email}
                  </p>
                </div>

                <Button
                  variant={followingMap[u.id] ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => toggleFollow(u.id)}
                  disabled={togglingFollow[u.id]}
                  className="w-28 shrink-0"
                >
                  {togglingFollow[u.id] && <Loader2Icon className="animate-spin" />}
                  {!togglingFollow[u.id] &&
                    (followingMap[u.id] ? <UserCheckIcon /> : <UserPlusIcon />)}
                  {followingMap[u.id] ? 'Following' : 'Follow'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
