import {
  ArrowLeftIcon,
  Loader2Icon,
  MessageSquareIcon,
  PencilIcon,
  SendIcon,
  Trash2Icon,
  UserIcon,
} from 'lucide-react'
import api from '@/apis'
import { useAuthStore } from '@/stores/auth'
import { timeAgo } from '@/utils/timeAgo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    username: string
    first_name: string
    last_name: string
    avatar_url?: string | null
  }
}

interface Post {
  id: string
  title: string
  content: string
  image_url?: string | null
  is_paid: boolean
  createdAt: string
  user: {
    id: string
    username: string
    first_name: string
    last_name: string
    avatar_url?: string | null
  }
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
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Back */}
      <Button variant="ghost" size="sm" className="mb-6" render={<Link to="/posts" />}>
        <ArrowLeftIcon />
        Back to Posts
      </Button>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && post && (
        <>
          {/* Detail Card */}
          <Card className="mb-6">
            <CardContent className="space-y-4">
              {editing ? (
                <form onSubmit={saveEdit} className="space-y-4">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    type="text"
                    className="text-lg font-semibold"
                  />
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={5}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" size="sm">
                      Save
                    </Button>
                  </div>
                </form>
              ) : (
                <article className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h1 className="text-2xl font-bold tracking-tight">{post.title}</h1>
                    {post.content && <p className="mt-3 text-muted-foreground">{post.content}</p>}
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="mt-3 max-h-96 w-full rounded-md border object-cover"
                      />
                    )}
                  </div>
                  {post.user.id === user?.id && (
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={startEdit}
                      className="shrink-0"
                      aria-label="Edit post"
                    >
                      <PencilIcon />
                    </Button>
                  )}
                </article>
              )}

              {/* Meta */}
              <Separator />
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link
                  to={`/users/${post.user.id}`}
                  className="flex items-center gap-1 transition-colors hover:text-foreground"
                >
                  <UserIcon className="size-3.5" />
                  {post.user.first_name} {post.user.last_name} (@{post.user.username})
                </Link>
                <span>{timeAgo(post.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquareIcon className="size-5" />
                Comments ({post.comments?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Comment */}
              <form onSubmit={addComment} className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1"
                  required
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={submittingComment}
                  aria-label="Send comment"
                >
                  {submittingComment ? <Loader2Icon className="animate-spin" /> : <SendIcon />}
                </Button>
              </form>

              {/* Comments List */}
              {post.comments?.length ? (
                <div className="space-y-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar>
                        {comment.user.avatar_url && (
                          <AvatarImage src={comment.user.avatar_url} alt={comment.user.username} />
                        )}
                        <AvatarFallback className="text-xs">
                          {comment.user.first_name[0]}
                          {comment.user.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 rounded-lg bg-muted p-3">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <Link
                            to={`/users/${comment.user.id}`}
                            className="text-sm font-semibold transition-colors hover:text-primary"
                          >
                            {comment.user.username}
                          </Link>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {timeAgo(comment.createdAt)}
                            </span>
                            {comment.user.id === user?.id && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={() => {
                                    setEditingCommentId(comment.id)
                                    setEditCommentContent(comment.content)
                                  }}
                                  aria-label="Edit comment"
                                >
                                  <PencilIcon />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon-xs"
                                  onClick={() => deleteComment(comment.id)}
                                  aria-label="Delete comment"
                                >
                                  <Trash2Icon />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {editingCommentId === comment.id ? (
                          <div className="flex gap-2">
                            <Input
                              value={editCommentContent}
                              onChange={(e) => setEditCommentContent(e.target.value)}
                              className="flex-1 bg-background"
                            />
                            <Button size="sm" onClick={() => saveEditComment(comment.id)}>
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingCommentId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm">{comment.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <MessageSquareIcon className="mx-auto mb-2 size-10 text-muted-foreground/40" />
                  <p>No comments yet. Be the first!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
