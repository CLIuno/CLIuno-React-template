import { useState } from 'react'
import './assets/App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://cliuno.github.io" target="_blank">
          <img src="./logo.png" className="logo react" alt="Cliuno logo" />
        </a>
      </div>
      <h1>Cliuno React Template</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
