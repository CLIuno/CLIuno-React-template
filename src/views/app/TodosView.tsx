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
    <div className="tw:max-w-4xl tw:mx-auto tw:px-4 tw:py-8">
      {/* Header */}
      <div className="tw:flex tw:items-center tw:justify-between tw:mb-8">
        <div>
          <h1 className="tw:text-3xl tw:font-bold tw:text-base-content">Todos</h1>
          <p className="tw:text-base-content/60">Manage your tasks and collaborate with others</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="tw:btn tw:btn-primary">
          <Icon icon="mdi:plus" className="tw:w-5 tw:h-5" />
          New Todo
        </button>
      </div>

      {/* Filters */}
      <div className="tw:tabs tw:tabs-boxed tw:mb-6 tw:w-fit">
        {(['all', 'mine', 'active', 'completed'] as Filter[]).map((f) => (
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
      {!loading && filteredTodos.length === 0 && (
        <div className="tw:text-center tw:py-20">
          <Icon
            icon="mdi:clipboard-check-outline"
            className="tw:w-16 tw:h-16 tw:mx-auto tw:text-base-content/30"
          />
          <h3 className="tw:text-xl tw:font-semibold tw:mt-4">No todos yet</h3>
          <p className="tw:text-base-content/60 tw:mt-2">Create your first todo to get started!</p>
        </div>
      )}

      {/* Todos List */}
      {!loading && filteredTodos.length > 0 && (
        <div className="tw:space-y-3">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="tw:card tw:bg-base-100 tw:shadow-sm hover:tw:shadow-md tw:transition-shadow"
            >
              <div className="tw:card-body tw:p-4">
                <div className="tw:flex tw:items-start tw:gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => todo.user.id === user?.id && toggleTodo(todo.id)}
                    className="tw:mt-1 tw:shrink-0"
                    disabled={todo.user.id !== user?.id}
                  >
                    <Icon
                      icon={
                        todo.is_completed
                          ? 'mdi:checkbox-marked-circle'
                          : 'mdi:checkbox-blank-circle-outline'
                      }
                      className={`tw:w-6 tw:h-6 ${todo.is_completed ? 'tw:text-success' : 'tw:text-base-content/30'}`}
                    />
                  </button>

                  {/* Content */}
                  <div className="tw:flex-1 tw:min-w-0">
                    <Link to={`/todos/${todo.id}`}>
                      <h3
                        className={`tw:font-semibold tw:text-lg hover:tw:text-primary tw:transition-colors ${todo.is_completed ? 'tw:line-through tw:opacity-60' : ''}`}
                      >
                        {todo.title}
                      </h3>
                    </Link>
                    {todo.description && (
                      <p className="tw:text-base-content/60 tw:text-sm tw:mt-1 tw:line-clamp-2">
                        {todo.description}
                      </p>
                    )}
                    <div className="tw:flex tw:items-center tw:gap-4 tw:mt-2 tw:text-sm tw:text-base-content/50">
                      <Link
                        to={`/users/${todo.user.id}`}
                        className="tw:flex tw:items-center tw:gap-1 hover:tw:text-primary"
                      >
                        <Icon icon="mdi:account" className="tw:w-4 tw:h-4" />
                        {todo.user.username}
                      </Link>
                      <span>{timeAgo(todo.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {todo.user.id === user?.id && (
                    <div className="tw:dropdown tw:dropdown-end">
                      <button className="tw:btn tw:btn-ghost tw:btn-sm tw:btn-circle">
                        <Icon icon="mdi:dots-vertical" className="tw:w-5 tw:h-5" />
                      </button>
                      <ul className="tw:dropdown-content tw:menu tw:p-2 tw:shadow tw:bg-base-100 tw:rounded-box tw:w-40 tw:z-10">
                        <li>
                          <Link to={`/todos/${todo.id}`}>
                            <Icon icon="mdi:eye" className="tw:w-4 tw:h-4" /> View
                          </Link>
                        </li>
                        <li>
                          <button onClick={() => deleteTodo(todo.id)} className="tw:text-error">
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
            <h3 className="tw:font-bold tw:text-lg tw:mb-4">Create New Todo</h3>
            <form onSubmit={createTodo} className="tw:space-y-4">
              <fieldset className="tw:fieldset">
                <legend className="tw:fieldset-legend">Title</legend>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  type="text"
                  placeholder="What needs to be done?"
                  className="tw:input tw:w-full"
                  required
                />
              </fieldset>
              <fieldset className="tw:fieldset">
                <legend className="tw:fieldset-legend">Description (optional)</legend>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Add more details..."
                  className="tw:textarea tw:textarea-bordered tw:w-full"
                  rows={3}
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
