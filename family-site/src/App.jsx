import { useState, useEffect } from 'react'
import PasswordGate from './components/PasswordGate'
import Entry from './components/Entry'
import NewEntryForm from './components/NewEntryForm'
import { fetchEntries } from './api'

function App() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    fetchEntries()
      .then(setEntries)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  return (
    <PasswordGate>
      <div className="page">
        <header className="header">
          <h1 className="site-title">我们家的日记本</h1>
          <p className="site-subtitle">照片、视频，和一些想记下来的话</p>
        </header>

        <main className="main">
          <NewEntryForm onPublished={load} />

          {loading && <p className="loading-hint">加载中…</p>}

          <div className="entry-list">
            {entries.map((entry) => (
              <Entry
                key={entry.id}
                entry={entry}
                onCommented={load}
                onDeleted={load}
              />
            ))}
          </div>
        </main>

        <footer className="footer">
          <p>只有家人知道这里</p>
        </footer>
      </div>
    </PasswordGate>
  )
}

export default App
