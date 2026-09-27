import { useState } from 'react'
import PasswordGate from './components/PasswordGate'
import Entry from './components/Entry'
import NewEntryForm from './components/NewEntryForm'
import { entries as initialEntries } from './data/entries'

function App() {
  const [entries, setEntries] = useState(initialEntries)

  function handleAdd(entry) {
    setEntries([entry, ...entries])
  }

  return (
    <PasswordGate>
      <div className="page">
        <header className="header">
          <h1 className="site-title">我们家的日记本</h1>
          <p className="site-subtitle">照片、视频，和一些想记下来的话</p>
        </header>

        <main className="main">
          <NewEntryForm onAdd={handleAdd} />
          <div className="entry-list">
            {entries.map((entry) => (
              <Entry key={entry.id} entry={entry} />
            ))}
          </div>
        </main>

        <footer className="footer">
          <p>只有家人知道这里 · 第一阶段 · 内容是假数据</p>
        </footer>
      </div>
    </PasswordGate>
  )
}

export default App
