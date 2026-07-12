import { Icon } from '@iconify/react'
import api from '@/apis'
import { useAuthStore } from '@/stores/auth'
import { timeAgo } from '@/utils/timeAgo'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: { id: string; username: string; first_name: string; last_name: string }
}

interface Post {
  id: string
  title: string
  content: string
  imageUrl: string
  is_paid: boolean
  createdAt: string
  user: { id: string; username: string; first_name: string; last_name: string }
  comments: Comment[]
}

export default function PostDetailView() {
  const { id: postId } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editCommentContent, setEditCommentContent] = useState('')

  const fetchPost = useCallback(async () => {
    if (!postId) return
    setLoading(true)
    try {
      const res = await api.post.getPostById(postId)
      setPost(res.data.data.post)
    } catch {
      // handle
    } finally {
      setLoading(false)
    }
  }, [postId])

  async function addComment(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!newComment.trim() || !postId) return
    setSubmittingComment(true)
    try {
      await api.post.createComment(postId, { content: newComment })
      setNewComment('')
      await fetchPost()
    } catch {
      // handle
    } finally {
      setSubmittingComment(false)
    }
  }

  async function deleteComment(commentId: string) {
    if (!postId) return
    try {
      await api.post.deleteComment(postId, commentId)
      setPost((prev) =>
        prev ? { ...prev, comments: prev.comments.filter((c) => c.id !== commentId) } : prev,
      )
    } catch {
      // handle
    }
  }

  function startEdit() {
    if (!post) return
    setEditTitle(post.title)
    setEditContent(post.content || '')
    setEditing(true)
  }

  async function saveEdit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!post || !postId) return
    try {
      await api.post.updatePostById(postId, { title: editTitle, content: editContent })
      setPost((prev) => (prev ? { ...prev, title: editTitle, content: editContent } : prev))
      setEditing(false)
    } catch {
      // handle
    }
  }

  async function saveEditComment(commentId: string) {
    if (!postId) return
    try {
      await api.post.updateComment(postId, commentId, { content: editCommentContent })
      setPost((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.map((c) =>
                c.id === commentId ? { ...c, content: editCommentContent } : c,
              ),
            }
          : prev,
      )
      setEditingCommentId(null)
    } catch {
      // handle
    }
  }

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  return (
    <div className="tw:max-w-3xl tw:mx-auto tw:px-4 tw:py-8">
      {/* Back */}
      <Link to="/posts" className="tw:btn tw:btn-ghost tw:btn-sm tw:mb-6">
        <Icon icon="mdi:arrow-left" className="tw:w-5 tw:h-5" />
        Back to Posts
      </Link>

      {/* Loading */}
      {loading && (
        <div className="tw:flex tw:justify-center tw:py-20">
          <span className="tw:loading tw:loading-spinner tw:loading-lg tw:text-primary" />
        </div>
      )}

      {!loading && post && (
        <>
          {/* Detail Card */}
          <div className="tw:card tw:bg-base-100 tw:shadow-lg tw:mb-6">
            <div className="tw:card-body">
              {editing ? (
                <form onSubmit={saveEdit} className="tw:space-y-4">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    type="text"
                    className="tw:input tw:input-bordered tw:w-full tw:text-xl tw:font-bold"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="tw:textarea tw:textarea-bordered tw:w-full"
                    rows={5}
                  />
                  <div className="tw:flex tw:gap-2 tw:justify-end">
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="tw:btn tw:btn-sm"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="tw:btn tw:btn-sm tw:btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <div className="tw:flex tw:items-start tw:justify-between">
                  <div>
                    <h1 className="tw:text-2xl tw:font-bold">{post.title}</h1>
                    {post.content && (
                      <p className="tw:mt-3 tw:text-base-content/70">{post.content}</p>
                    )}
                  </div>
                  {post.user.id === user?.id && (
                    <div className="tw:flex tw:gap-2">
                      <button onClick={startEdit} className="tw:btn tw:btn-sm tw:btn-outline">
                        <Icon icon="mdi:pencil" className="tw:w-4 tw:h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Meta */}
              <div className="tw:flex tw:items-center tw:gap-4 tw:mt-4 tw:pt-4 tw:border-t tw:border-base-200 tw:text-sm tw:text-base-content/50">
                <Link
                  to={`/users/${post.user.id}`}
                  className="tw:flex tw:items-center tw:gap-1 hover:tw:text-primary"
                >
                  <Icon icon="mdi:account" className="tw:w-4 tw:h-4" />
                  {post.user.first_name} {post.user.last_name} (@{post.user.username})
                </Link>
                <span>{timeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="tw:card tw:bg-base-100 tw:shadow-lg">
            <div className="tw:card-body">
              <h2 className="tw:text-xl tw:font-bold tw:mb-4">
                <Icon
                  icon="mdi:comment-multiple-outline"
                  className="tw:w-6 tw:h-6 tw:inline tw:mr-1"
                />
                Comments ({post.comments?.length || 0})
              </h2>

              {/* Add Comment */}
              <form onSubmit={addComment} className="tw:mb-6">
                <div className="tw:flex tw:gap-2">
                  <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    type="text"
                    placeholder="Write a comment..."
                    className="tw:input tw:input-bordered tw:flex-1"
                    required
                  />
                  <button
                    type="submit"
                    className="tw:btn tw:btn-primary"
                    disabled={submittingComment}
                  >
                    <Icon icon="mdi:send" className="tw:w-5 tw:h-5" />
                  </button>
                </div>
              </form>

              {/* Comments List */}
              {post.comments?.length ? (
                <div className="tw:space-y-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="tw:flex tw:gap-3">
                      <div className="tw:avatar tw:placeholder">
                        <div className="tw:bg-neutral tw:text-neutral-content tw:w-8 tw:h-8 tw:rounded-full">
                          <span className="tw:text-xs">
                            {comment.user.first_name[0]}
                            {comment.user.last_name[0]}
                          </span>
                        </div>
                      </div>
                      <div className="tw:flex-1 tw:bg-base-200 tw:rounded-lg tw:p-3">
                        <div className="tw:flex tw:items-center tw:justify-between tw:mb-1">
                          <Link
                            to={`/users/${comment.user.id}`}
                            className="tw:font-semibold tw:text-sm hover:tw:text-primary"
                          >
                            {comment.user.username}
                          </Link>
                          <div className="tw:flex tw:items-center tw:gap-2">
                            <span className="tw:text-xs tw:text-base-content/50">
                              {timeAgo(comment.createdAt)}
                            </span>
                            {comment.user.id === user?.id && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingCommentId(comment.id)
                                    setEditCommentContent(comment.content)
                                  }}
                                  className="tw:btn tw:btn-ghost tw:btn-xs"
                                >
                                  <Icon icon="mdi:pencil" className="tw:w-3 tw:h-3" />
                                </button>
                                <button
                                  onClick={() => deleteComment(comment.id)}
                                  className="tw:btn tw:btn-ghost tw:btn-xs tw:text-error"
                                >
                                  <Icon icon="mdi:delete" className="tw:w-3 tw:h-3" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {editingCommentId === comment.id ? (
                          <div className="tw:flex tw:gap-2">
                            <input
                              value={editCommentContent}
                              onChange={(e) => setEditCommentContent(e.target.value)}
                              className="tw:input tw:input-sm tw:input-bordered tw:flex-1"
                            />
                            <button
                              onClick={() => saveEditComment(comment.id)}
                              className="tw:btn tw:btn-sm tw:btn-primary"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingCommentId(null)}
                              className="tw:btn tw:btn-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <p className="tw:text-sm">{comment.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="tw:text-center tw:py-8 tw:text-base-content/40">
                  <Icon
                    icon="mdi:comment-off-outline"
                    className="tw:w-10 tw:h-10 tw:mx-auto tw:mb-2"
                  />
                  <p>No comments yet. Be the first!</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
