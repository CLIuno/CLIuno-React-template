import {
  FileTextIcon,
  Loader2Icon,
  MessageSquareIcon,
  PlusIcon,
  Trash2Icon,
  UserIcon,
} from 'lucide-react'
import api from '@/apis'
import { useImageUpload } from '@/hooks/useImageUpload'
import { useAuthStore } from '@/stores/auth'
import { timeAgo } from '@/utils/timeAgo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface Post {
  id: string
  title: string
  content: string
  image_url: string | null
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
  const [newImageUrl, setNewImageUrl] = useState('')
  const { uploading, uploadError, uploadImage } = useImageUpload()
  const postImageRef = useRef<HTMLInputElement>(null)
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

  async function onPostImagePicked(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target
    const file = input.files?.[0]
    if (!file) return
    const url = await uploadImage(file)
    if (url) setNewImageUrl(url)
    input.value = ''
  }

  async function createPost(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!newTitle.trim() || !newContent.trim()) return
    setCreating(true)
    try {
      await api.post.createPost({
        title: newTitle,
        content: newContent,
        ...(newImageUrl ? { image_url: newImageUrl } : {}),
      })
      setNewTitle('')
      setNewContent('')
      setNewImageUrl('')
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
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground">Share and discuss with the community</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <PlusIcon />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 inline-flex w-fit items-center gap-1 rounded-lg bg-muted p-1">
        {(['all', 'mine'] as Filter[]).map((f) => (
          <Button
            key={f}
            variant="ghost"
            size="sm"
            onClick={() => setFilter(f)}
            className={cn(
              'text-muted-foreground',
              filter === f && 'bg-background text-foreground shadow-sm hover:bg-background',
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredPosts.length === 0 && (
        <div className="py-20 text-center">
          <FileTextIcon className="mx-auto size-14 text-muted-foreground/40" />
          <h3 className="mt-4 text-xl font-semibold">No posts yet</h3>
          <p className="mt-2 text-muted-foreground">Create your first post to get started!</p>
        </div>
      )}

      {/* Posts List */}
      {!loading && filteredPosts.length > 0 && (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-start gap-3">
                {/* Content */}
                <div className="min-w-0 flex-1">
                  <Link to={`/posts/${post.id}`}>
                    <h3 className="text-lg font-semibold transition-colors hover:text-primary">
                      {post.title}
                    </h3>
                  </Link>
                  {post.content && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {post.content}
                    </p>
                  )}
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="mt-2 max-h-64 w-full rounded-md border object-cover"
                    />
                  )}
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <Link
                      to={`/users/${post.user.id}`}
                      className="flex items-center gap-1 transition-colors hover:text-foreground"
                    >
                      <UserIcon className="size-3.5" />
                      {post.user.username}
                    </Link>
                    <span className="flex items-center gap-1">
                      <MessageSquareIcon className="size-3.5" />
                      {post.comments?.length || 0}
                    </span>
                    <span>{timeAgo(post.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                {post.user.id === user?.id && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => deletePost(post.id)}
                    className="text-destructive hover:text-destructive"
                    aria-label="Delete post"
                  >
                    <Trash2Icon />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>Share something with the community.</DialogDescription>
          </DialogHeader>
          <form onSubmit={createPost} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="post-title">Title</Label>
              <Input
                id="post-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                type="text"
                placeholder="Post title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-content">Content</Label>
              <Textarea
                id="post-content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write your post..."
                rows={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="flex items-center gap-3">
                <input
                  ref={postImageRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={onPostImagePicked}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => postImageRef.current?.click()}
                >
                  {uploading ? 'Uploading…' : newImageUrl ? 'Replace image' : 'Add image'}
                </Button>
                {newImageUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setNewImageUrl('')}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {newImageUrl && (
                <img
                  src={newImageUrl}
                  alt="Selected preview"
                  className="max-h-40 rounded-md border object-cover"
                />
              )}
              {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating && <Loader2Icon className="animate-spin" />}
                {creating ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
