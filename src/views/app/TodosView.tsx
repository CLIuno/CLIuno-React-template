import { ClipboardCheckIcon, Loader2Icon, PlusIcon, Trash2Icon, UserIcon } from 'lucide-react'
import api from '@/apis'
import { useAuthStore } from '@/stores/auth'
import { timeAgo } from '@/utils/timeAgo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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

interface Todo {
  id: string
  title: string
  description: string
  is_completed: boolean
  createdAt: string
  user: { id: string; username: string; first_name: string; last_name: string }
}

type Filter = 'all' | 'mine' | 'active' | 'completed'

export default function TodosView() {
  const { user } = useAuthStore()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')

  const filteredTodos = todos.filter((t) => {
    if (filter === 'mine') return t.user.id === user?.id
    if (filter === 'active') return !t.is_completed
    if (filter === 'completed') return t.is_completed
    return true
  })

  const fetchTodos = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.todo.getAllTodos()
      setTodos(res.data.data.todos)
    } catch {
      // handle
    } finally {
      setLoading(false)
    }
  }, [])

  async function createTodo(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setCreating(true)
    try {
      await api.todo.createTodo({ title: newTitle, description: newDescription })
      setNewTitle('')
      setNewDescription('')
      setShowCreateModal(false)
      await fetchTodos()
    } catch {
      // handle
    } finally {
      setCreating(false)
    }
  }

  async function toggleTodo(id: string) {
    try {
      await api.todo.toggleTodo(id)
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_completed: !t.is_completed } : t)),
      )
    } catch {
      // handle
    }
  }

  async function deleteTodo(id: string) {
    try {
      await api.todo.deleteTodo(id)
      setTodos((prev) => prev.filter((t) => t.id !== id))
    } catch {
      // handle
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Todos</h1>
          <p className="text-muted-foreground">Manage your tasks and collaborate with others</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <PlusIcon />
          New Todo
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 inline-flex w-fit items-center gap-1 rounded-lg bg-muted p-1">
        {(['all', 'mine', 'active', 'completed'] as Filter[]).map((f) => (
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
      {!loading && filteredTodos.length === 0 && (
        <div className="py-20 text-center">
          <ClipboardCheckIcon className="mx-auto size-14 text-muted-foreground/40" />
          <h3 className="mt-4 text-xl font-semibold">No todos yet</h3>
          <p className="mt-2 text-muted-foreground">Create your first todo to get started!</p>
        </div>
      )}

      {/* Todos List */}
      {!loading && filteredTodos.length > 0 && (
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <Card key={todo.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-start gap-3">
                {/* Checkbox */}
                <Checkbox
                  checked={todo.is_completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  disabled={todo.user.id !== user?.id}
                  className="mt-1"
                  aria-label={todo.is_completed ? 'Mark as active' : 'Mark as completed'}
                />

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <Link to={`/todos/${todo.id}`}>
                    <h3
                      className={cn(
                        'text-lg font-semibold transition-colors hover:text-primary',
                        todo.is_completed && 'text-muted-foreground line-through',
                      )}
                    >
                      {todo.title}
                    </h3>
                  </Link>
                  {todo.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {todo.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <Link
                      to={`/users/${todo.user.id}`}
                      className="flex items-center gap-1 transition-colors hover:text-foreground"
                    >
                      <UserIcon className="size-3.5" />
                      {todo.user.username}
                    </Link>
                    <span>{timeAgo(todo.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                {todo.user.id === user?.id && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => deleteTodo(todo.id)}
                    className="text-destructive hover:text-destructive"
                    aria-label="Delete todo"
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
            <DialogTitle>Create New Todo</DialogTitle>
            <DialogDescription>Add a task to your list.</DialogDescription>
          </DialogHeader>
          <form onSubmit={createTodo} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="todo-title">Title</Label>
              <Input
                id="todo-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                type="text"
                placeholder="What needs to be done?"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="todo-description">Description (optional)</Label>
              <Textarea
                id="todo-description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Add more details..."
                rows={3}
              />
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
