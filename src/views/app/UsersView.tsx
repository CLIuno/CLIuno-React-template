import { Icon } from '@iconify/react'
import api from '@/apis'
import { useAuthStore } from '@/stores/auth'

interface UserItem {
  id: string
  username: string
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
    <div className="tw:max-w-4xl tw:mx-auto tw:px-4 tw:py-8">
      <div className="tw:mb-8">
        <h1 className="tw:text-3xl tw:font-bold tw:text-base-content">Users</h1>
        <p className="tw:text-base-content/60">Discover and follow other users</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="tw:flex tw:justify-center tw:py-20">
          <span className="tw:loading tw:loading-spinner tw:loading-lg tw:text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!loading && users.length === 0 && (
        <div className="tw:text-center tw:py-20">
          <Icon
            icon="mdi:account-group-outline"
            className="tw:w-16 tw:h-16 tw:mx-auto tw:text-base-content/30"
          />
          <h3 className="tw:text-xl tw:font-semibold tw:mt-4">No other users yet</h3>
          <p className="tw:text-base-content/60 tw:mt-2">Be the first to invite someone!</p>
        </div>
      )}

      {/* Users Grid */}
      {!loading && users.length > 0 && (
        <div className="tw:grid tw:grid-cols-1 sm:tw:grid-cols-2 lg:tw:grid-cols-3 tw:gap-4">
          {users.map((u) => (
            <div
              key={u.id}
              className="tw:card tw:bg-base-100 tw:shadow-sm hover:tw:shadow-md tw:transition-shadow"
            >
              <div className="tw:card-body tw:items-center tw:text-center tw:p-6">
                {/* Avatar */}
                <div className="tw:avatar tw:placeholder tw:mb-2">
                  <div className="tw:bg-primary tw:text-primary-content tw:w-16 tw:h-16 tw:rounded-full">
                    <span className="tw:text-xl">
                      {u.first_name[0]}
                      {u.last_name[0]}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/users/${u.id}`}
                  className="tw:font-bold tw:text-lg hover:tw:text-primary tw:transition-colors"
                >
                  {u.first_name} {u.last_name}
                </Link>
                <p className="tw:text-base-content/60 tw:text-sm">@{u.username}</p>

                <button
                  onClick={() => toggleFollow(u.id)}
                  disabled={togglingFollow[u.id]}
                  className={`tw:btn tw:btn-sm tw:w-full tw:mt-2 ${followingMap[u.id] ? 'tw:btn-outline' : 'tw:btn-primary'}`}
                >
                  {togglingFollow[u.id] ? (
                    <span className="tw:loading tw:loading-spinner tw:loading-xs" />
                  ) : (
                    <Icon
                      icon={followingMap[u.id] ? 'mdi:account-check' : 'mdi:account-plus'}
                      className="tw:w-4 tw:h-4"
                    />
                  )}
                  {followingMap[u.id] ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
