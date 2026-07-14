import { ArrowLeftIcon, Loader2Icon, UserCheckIcon, UserPlusIcon, UsersIcon } from 'lucide-react'
import api from '@/apis'
import { useAuthStore } from '@/stores/auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface ProfileUser {
  id: string
  username: string
  first_name: string
  last_name: string
  email: string
}

interface FollowUser {
  id: string
  username: string
  first_name: string
  last_name: string
}

function FollowList({ users, emptyText }: Readonly<{ users: FollowUser[]; emptyText: string }>) {
  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyText}</p>
  }
  return (
    <div className="space-y-1">
      {users.map((f) => (
        <Link
          key={f.id}
          to={`/users/${f.id}`}
          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
        >
          <Avatar>
            <AvatarFallback className="text-xs">
              {f.first_name[0]}
              {f.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {f.first_name} {f.last_name}
            </p>
            <p className="text-xs text-muted-foreground">@{f.username}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function UserProfileView() {
  const { id: userId } = useParams<{ id: string }>()
  const { user: currentUser } = useAuthStore()
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [togglingFollow, setTogglingFollow] = useState(false)
  const [followers, setFollowers] = useState<FollowUser[]>([])
  const [following, setFollowing] = useState<FollowUser[]>([])

  const isOwnProfile = currentUser?.id === userId

  const fetchProfile = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const [userRes, followersRes, followingRes] = await Promise.all([
        api.user.getUserById(userId),
        api.follow.getFollowers(userId),
        api.follow.getFollowing(userId),
      ])
      setProfileUser(userRes.data.data.user)
      setFollowers(followersRes.data.data.followers)
      setFollowing(followingRes.data.data.following)

      if (!isOwnProfile) {
        const r = await api.follow.isFollowing(userId)
        setIsFollowing(r.data.data.isFollowing)
      }
    } catch {
      // handle
    } finally {
      setLoading(false)
    }
  }, [userId, isOwnProfile])

  async function toggleFollow() {
    if (!userId) return
    setTogglingFollow(true)
    try {
      if (isFollowing) {
        await api.follow.unfollow(userId)
        setIsFollowing(false)
        setFollowers((prev) => prev.filter((f) => f.id !== currentUser?.id))
      } else {
        await api.follow.follow(userId)
        setIsFollowing(true)
        if (currentUser) {
          setFollowers((prev) => [
            ...prev,
            {
              id: currentUser.id,
              username: currentUser.username,
              first_name: currentUser.first_name,
              last_name: currentUser.last_name,
            },
          ])
        }
      }
    } catch {
      // handle
    } finally {
      setTogglingFollow(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Button variant="ghost" size="sm" className="mb-6" render={<Link to="/users" />}>
        <ArrowLeftIcon />
        Back to Users
      </Button>

      {loading && (
        <div className="flex justify-center py-20">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && profileUser && (
        <>
          {/* Profile Card */}
          <Card className="mb-6">
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <Avatar className="size-20">
                  <AvatarFallback className="text-2xl">
                    {profileUser.first_name[0]}
                    {profileUser.last_name[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl font-bold tracking-tight">
                    {profileUser.first_name} {profileUser.last_name}
                  </h1>
                  <p className="text-muted-foreground">@{profileUser.username}</p>
                </div>

                {!isOwnProfile && (
                  <Button
                    variant={isFollowing ? 'outline' : 'default'}
                    onClick={toggleFollow}
                    disabled={togglingFollow}
                    className="shrink-0"
                  >
                    {togglingFollow && <Loader2Icon className="animate-spin" />}
                    {!togglingFollow && (isFollowing ? <UserCheckIcon /> : <UserPlusIcon />)}
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>

              <Separator />

              {/* Counts */}
              <div className="flex gap-6 text-sm">
                <p>
                  <span className="font-semibold">{followers.length}</span>{' '}
                  <span className="text-muted-foreground">Followers</span>
                </p>
                <p>
                  <span className="font-semibold">{following.length}</span>{' '}
                  <span className="text-muted-foreground">Following</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Followers / Following Lists */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="size-4" />
                  Followers ({followers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FollowList users={followers} emptyText="No followers yet" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheckIcon className="size-4" />
                  Following ({following.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FollowList users={following} emptyText="Not following anyone yet" />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
