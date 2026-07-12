import { Icon } from '@iconify/react'
import api from '@/apis'
import { useAuthStore } from '@/stores/auth'
import { timeAgo } from '@/utils/timeAgo'

interface Post {
  id: string
  title: string
  content: string
  imageUrl: string
  is_paid: boolean
  createdAt: string
  user: { id: string; username: string; first_name: string; last_name: string }
  comments: Record<string, unknown>[]
}

type Filter = 'all' | 'mine'

export default function PostsView() {
  const { user } = useAuthStore()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [creating, setCreating] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')

  const filteredPosts = posts.filter((p) => {
    if (filter === 'mine') return p.user.id === user?.id
    return true
  })

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.post.getAllPosts()
      setPosts(res.data.data.posts)
    } catch {
      // handle
    } finally {
      setLoading(false)
    }
  }, [])

  async function createPost(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!newTitle.trim() || !newContent.trim()) return
    setCreating(true)
    try {
      await api.post.createPost({ title: newTitle, content: newContent })
      setNewTitle('')
      setNewContent('')
      setShowCreateModal(false)
      await fetchPosts()
    } catch {
      // handle
    } finally {
      setCreating(false)
    }
  }

  async function deletePost(id: string) {
    try {
      await api.post.deletePostById(id)
      setPosts((prev) => prev.filter((p) => p.id !== id))
    } catch {
      // handle
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return (
    <div className="tw:max-w-4xl tw:mx-auto tw:px-4 tw:py-8">
      {/* Header */}
      <div className="tw:flex tw:items-center tw:justify-between tw:mb-8">
        <div>
          <h1 className="tw:text-3xl tw:font-bold tw:text-base-content">Posts</h1>
          <p className="tw:text-base-content/60">Share and discuss with the community</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="tw:btn tw:btn-primary">
          <Icon icon="mdi:plus" className="tw:w-5 tw:h-5" />
          New Post
        </button>
      </div>

      {/* Filters */}
      <div className="tw:tabs tw:tabs-boxed tw:mb-6 tw:w-fit">
        {(['all', 'mine'] as Filter[]).map((f) => (
          <button
            key={f}
            className={`tw:tab ${filter === f ? 'tw:tab-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="tw:flex tw:justify-center tw:py-20">
          <span className="tw:loading tw:loading-spinner tw:loading-lg tw:text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredPosts.length === 0 && (
        <div className="tw:text-center tw:py-20">
          <Icon
            icon="mdi:post-outline"
            className="tw:w-16 tw:h-16 tw:mx-auto tw:text-base-content/30"
          />
          <h3 className="tw:text-xl tw:font-semibold tw:mt-4">No posts yet</h3>
          <p className="tw:text-base-content/60 tw:mt-2">Create your first post to get started!</p>
        </div>
      )}

      {/* Posts List */}
      {!loading && filteredPosts.length > 0 && (
        <div className="tw:space-y-3">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="tw:card tw:bg-base-100 tw:shadow-sm hover:tw:shadow-md tw:transition-shadow"
            >
              <div className="tw:card-body tw:p-4">
                <div className="tw:flex tw:items-start tw:gap-3">
                  {/* Content */}
                  <div className="tw:flex-1 tw:min-w-0">
                    <Link to={`/posts/${post.id}`}>
                      <h3 className="tw:font-semibold tw:text-lg hover:tw:text-primary tw:transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    {post.content && (
                      <p className="tw:text-base-content/60 tw:text-sm tw:mt-1 tw:line-clamp-2">
                        {post.content}
                      </p>
                    )}
                    <div className="tw:flex tw:items-center tw:gap-4 tw:mt-2 tw:text-sm tw:text-base-content/50">
                      <Link
                        to={`/users/${post.user.id}`}
                        className="tw:flex tw:items-center tw:gap-1 hover:tw:text-primary"
                      >
                        <Icon icon="mdi:account" className="tw:w-4 tw:h-4" />
                        {post.user.username}
                      </Link>
                      <span className="tw:flex tw:items-center tw:gap-1">
                        <Icon icon="mdi:comment-outline" className="tw:w-4 tw:h-4" />
                        {post.comments?.length || 0}
                      </span>
                      <span>{timeAgo(post.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {post.user.id === user?.id && (
                    <div className="tw:dropdown tw:dropdown-end">
                      <button className="tw:btn tw:btn-ghost tw:btn-sm tw:btn-circle">
                        <Icon icon="mdi:dots-vertical" className="tw:w-5 tw:h-5" />
                      </button>
                      <ul className="tw:dropdown-content tw:menu tw:p-2 tw:shadow tw:bg-base-100 tw:rounded-box tw:w-40 tw:z-10">
                        <li>
                          <Link to={`/posts/${post.id}`}>
                            <Icon icon="mdi:eye" className="tw:w-4 tw:h-4" /> View
                          </Link>
                        </li>
                        <li>
                          <button onClick={() => deletePost(post.id)} className="tw:text-error">
                            <Icon icon="mdi:delete" className="tw:w-4 tw:h-4" /> Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="tw:modal tw:modal-open">
          <div className="tw:modal-box">
            <h3 className="tw:font-bold tw:text-lg tw:mb-4">Create New Post</h3>
            <form onSubmit={createPost} className="tw:space-y-4">
              <fieldset className="tw:fieldset">
                <legend className="tw:fieldset-legend">Title</legend>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  type="text"
                  placeholder="Post title"
                  className="tw:input tw:w-full"
                  required
                />
              </fieldset>
              <fieldset className="tw:fieldset">
                <legend className="tw:fieldset-legend">Content</legend>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write your post..."
                  className="tw:textarea tw:textarea-bordered tw:w-full"
                  rows={5}
                  required
                />
              </fieldset>
              <div className="tw:modal-action">
                <button type="button" onClick={() => setShowCreateModal(false)} className="tw:btn">
                  Cancel
                </button>
                <button type="submit" className="tw:btn tw:btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
          <button
            type="button"
            className="tw:modal-backdrop"
            onClick={() => setShowCreateModal(false)}
            aria-label="Close modal"
          />
        </div>
      )}
    </div>
  )
}
