import { Icon } from '@iconify/react'
import api from '@/apis'
import { useAuthStore } from '@/stores/auth'
import { timeAgo } from '@/utils/timeAgo'

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
    <div className="tw:max-w-3xl tw:mx-auto tw:px-4 tw:py-8">
      {/* Back */}
      <Link to="/todos" className="tw:btn tw:btn-ghost tw:btn-sm tw:mb-6">
        <Icon icon="mdi:arrow-left" className="tw:w-5 tw:h-5" />
        Back to Todos
      </Link>

      {/* Loading */}
      {loading && (
        <div className="tw:flex tw:justify-center tw:py-20">
          <span className="tw:loading tw:loading-spinner tw:loading-lg tw:text-primary" />
        </div>
      )}

      {!loading && todo && (
        <div className="tw:card tw:bg-base-100 tw:shadow-lg">
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
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="tw:textarea tw:textarea-bordered tw:w-full"
                  rows={3}
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
                  <div className="tw:flex tw:items-center tw:gap-3 tw:mb-2">
                    <span
                      className={`tw:badge ${todo.is_completed ? 'tw:badge-success' : 'tw:badge-warning'}`}
                    >
                      {todo.is_completed ? 'Completed' : 'Active'}
                    </span>
                  </div>
                  <h1
                    className={`tw:text-2xl tw:font-bold ${todo.is_completed ? 'tw:line-through tw:opacity-60' : ''}`}
                  >
                    {todo.title}
                  </h1>
                  {todo.description && (
                    <p className="tw:mt-3 tw:text-base-content/70">{todo.description}</p>
                  )}
                </div>
                {todo.user.id === user?.id && (
                  <div className="tw:flex tw:gap-2">
                    <button
                      onClick={toggleComplete}
                      className={`tw:btn tw:btn-sm tw:btn-outline ${todo.is_completed ? 'tw:btn-warning' : 'tw:btn-success'}`}
                    >
                      <Icon
                        icon={todo.is_completed ? 'mdi:undo' : 'mdi:check'}
                        className="tw:w-4 tw:h-4"
                      />
                      {todo.is_completed ? 'Reopen' : 'Complete'}
                    </button>
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
                to={`/users/${todo.user.id}`}
                className="tw:flex tw:items-center tw:gap-1 hover:tw:text-primary"
              >
                <Icon icon="mdi:account" className="tw:w-4 tw:h-4" />
                {todo.user.first_name} {todo.user.last_name} (@{todo.user.username})
              </Link>
              <span>{timeAgo(todo.createdAt)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
