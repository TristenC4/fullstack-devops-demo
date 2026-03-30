import { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState('checking...')
  const [tasks, setTasks] = useState([])
  const [text, setText] = useState('')

  const loadTasks = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/tasks')
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      console.error('Failed to load tasks', err)
    }
  }

  useEffect(() => {
    fetch('http://localhost:3001/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('error'))

    loadTasks()
  }, [])

  const addTask = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    try {
      const res = await fetch('http://localhost:3001/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!res.ok) throw new Error('Failed to add task')

      setText('')
      loadTasks()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>DevOps Mini App</h1>
      <p>
        Backend Status: <strong>{status}</strong>
      </p>

      <form onSubmit={addTask}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a task"
        />
        <button type="submit" style={{ marginLeft: '0.5rem' }}>
          Add Task
        </button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.text}</li>
        ))}
      </ul>
    </div>
  )
}

export default App