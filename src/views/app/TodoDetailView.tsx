import {
  ArrowLeftIcon,
  CheckIcon,
  Loader2Icon,
  PencilIcon,
  Undo2Icon,
  UserIcon,
} from 'lucide-react'
import api from '@/apis'
import { useAuthStore } from '@/stores/auth'
import { timeAgo } from '@/utils/timeAgo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface Todo {
  id: string
  title: string
  description: string
  is_completed: boolean
  createdAt: string
  user: { id: string; username: string; first_name: string; last_name: string }
}

export default function TodoDetailView() {
  const { id: todoId } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const [todo, setTodo] = useState<Todo | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const fetchTodo = useCallback(async () => {
    if (!todoId) return
    setLoading(true)
    try {
      const res = await api.todo.getTodoById(todoId)
      setTodo(res.data.data.todo)
    } catch {
      // handle
    } finally {
      setLoading(false)
    }
  }, [todoId])

  async function toggleComplete() {
    if (!todo || !todoId) return
    try {
      await api.todo.toggleTodo(todoId)
      setTodo((prev) => (prev ? { ...prev, is_completed: !prev.is_completed } : prev))
    } catch {
      // handle
    }
  }

  function startEdit() {
    if (!todo) return
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
    setEditing(true)
  }

  async function saveEdit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!todo || !todoId) return
    try {
      await api.todo.updateTodo(todoId, { title: editTitle, description: editDescription })
      setTodo((prev) => (prev ? { ...prev, title: editTitle, description: editDescription } : prev))
      setEditing(false)
    } catch {
      // handle
    }
  }

  useEffect(() => {
    fetchTodo()
  }, [fetchTodo])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Back */}
      <Button variant="ghost" size="sm" className="mb-6" render={<Link to="/todos" />}>
        <ArrowLeftIcon />
        Back to Todos
      </Button>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && todo && (
        <Card>
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
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
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
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant={todo.is_completed ? 'secondary' : 'outline'} className="mb-2">
                    {todo.is_completed ? 'Completed' : 'Active'}
                  </Badge>
                  <h1
                    className={cn(
                      'text-2xl font-bold tracking-tight',
                      todo.is_completed && 'text-muted-foreground line-through',
                    )}
                  >
                    {todo.title}
                  </h1>
                  {todo.description && (
                    <p className="mt-3 text-muted-foreground">{todo.description}</p>
                  )}
                </div>
                {todo.user.id === user?.id && (
                  <div className="flex shrink-0 gap-2">
                    <Button variant="outline" size="sm" onClick={toggleComplete}>
                      {todo.is_completed ? <Undo2Icon /> : <CheckIcon />}
                      {todo.is_completed ? 'Reopen' : 'Complete'}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={startEdit}
                      aria-label="Edit todo"
                    >
                      <PencilIcon />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Meta */}
            <Separator />
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link
                to={`/users/${todo.user.id}`}
                className="flex items-center gap-1 transition-colors hover:text-foreground"
              >
                <UserIcon className="size-3.5" />
                {todo.user.first_name} {todo.user.last_name} (@{todo.user.username})
              </Link>
              <span>{timeAgo(todo.createdAt)}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
