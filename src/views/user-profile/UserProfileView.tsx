import { Icon } from '@iconify/react'
import api from '@/apis'
import { useAuthStore } from '@/stores/auth'

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
    <div className="tw:max-w-3xl tw:mx-auto tw:px-4 tw:py-8">
      <Link to="/users" className="tw:btn tw:btn-ghost tw:btn-sm tw:mb-6">
        <Icon icon="mdi:arrow-left" className="tw:w-5 tw:h-5" />
        Back to Users
      </Link>

      {loading && (
        <div className="tw:flex tw:justify-center tw:py-20">
          <span className="tw:loading tw:loading-spinner tw:loading-lg tw:text-primary" />
        </div>
      )}

      {!loading && profileUser && (
        <>
          {/* Profile Card */}
          <div className="tw:card tw:bg-base-100 tw:shadow-lg tw:overflow-hidden tw:mb-6">
            {/* Cover */}
            <div className="tw:h-32 tw:bg-linear-to-r tw:from-primary tw:to-secondary" />

            <div className="tw:card-body tw:pt-0">
              {/* Avatar */}
              <div className="tw:flex tw:items-end tw:gap-4 tw:-mt-12">
                <div className="tw:avatar tw:placeholder">
                  <div className="tw:bg-primary tw:text-primary-content tw:w-24 tw:h-24 tw:rounded-full tw:ring-4 tw:ring-base-100">
                    <span className="tw:text-3xl">
                      {profileUser.first_name[0]}
                      {profileUser.last_name[0]}
                    </span>
                  </div>
                </div>
                <div className="tw:flex-1 tw:mb-2">
                  <h1 className="tw:text-2xl tw:font-bold">
                    {profileUser.first_name} {profileUser.last_name}
                  </h1>
                  <p className="tw:text-base-content/60">@{profileUser.username}</p>
                </div>
                {!isOwnProfile && (
                  <button
                    onClick={toggleFollow}
                    disabled={togglingFollow}
                    className={`tw:btn tw:mb-2 ${isFollowing ? 'tw:btn-outline' : 'tw:btn-primary'}`}
                  >
                    {togglingFollow ? (
                      <span className="tw:loading tw:loading-spinner tw:loading-xs" />
                    ) : (
                      <Icon
                        icon={isFollowing ? 'mdi:account-check' : 'mdi:account-plus'}
                        className="tw:w-5 tw:h-5"
                      />
                    )}
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="tw:stats tw:shadow tw:mt-4">
                <div className="tw:stat tw:place-items-center">
                  <div className="tw:stat-title">Followers</div>
                  <div className="tw:stat-value tw:text-primary">{followers.length}</div>
                </div>
                <div className="tw:stat tw:place-items-center">
                  <div className="tw:stat-title">Following</div>
                  <div className="tw:stat-value tw:text-secondary">{following.length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Followers / Following Lists */}
          <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4">
            {/* Followers */}
            <div className="tw:card tw:bg-base-100 tw:shadow-sm">
              <div className="tw:card-body">
                <h2 className="tw:card-title tw:text-lg">
                  <Icon icon="mdi:account-group" className="tw:w-5 tw:h-5" />
                  Followers ({followers.length})
                </h2>
                {followers.length === 0 ? (
                  <p className="tw:text-base-content/50 tw:text-sm">No followers yet</p>
                ) : (
                  <div className="tw:space-y-2">
                    {followers.map((f) => (
                      <Link
                        key={f.id}
                        to={`/users/${f.id}`}
                        className="tw:flex tw:items-center tw:gap-3 tw:p-2 tw:rounded-lg hover:tw:bg-base-200 tw:transition-colors"
                      >
                        <div className="tw:avatar tw:placeholder">
                          <div className="tw:bg-neutral tw:text-neutral-content tw:w-8 tw:h-8 tw:rounded-full">
                            <span className="tw:text-xs">
                              {f.first_name[0]}
                              {f.last_name[0]}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="tw:font-medium tw:text-sm">
                            {f.first_name} {f.last_name}
                          </p>
                          <p className="tw:text-xs tw:text-base-content/50">@{f.username}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Following */}
            <div className="tw:card tw:bg-base-100 tw:shadow-sm">
              <div className="tw:card-body">
                <h2 className="tw:card-title tw:text-lg">
                  <Icon icon="mdi:account-arrow-right" className="tw:w-5 tw:h-5" />
                  Following ({following.length})
                </h2>
                {following.length === 0 ? (
                  <p className="tw:text-base-content/50 tw:text-sm">Not following anyone yet</p>
                ) : (
                  <div className="tw:space-y-2">
                    {following.map((f) => (
                      <Link
                        key={f.id}
                        to={`/users/${f.id}`}
                        className="tw:flex tw:items-center tw:gap-3 tw:p-2 tw:rounded-lg hover:tw:bg-base-200 tw:transition-colors"
                      >
                        <div className="tw:avatar tw:placeholder">
                          <div className="tw:bg-neutral tw:text-neutral-content tw:w-8 tw:h-8 tw:rounded-full">
                            <span className="tw:text-xs">
                              {f.first_name[0]}
                              {f.last_name[0]}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="tw:font-medium tw:text-sm">
                            {f.first_name} {f.last_name}
                          </p>
                          <p className="tw:text-xs tw:text-base-content/50">@{f.username}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
