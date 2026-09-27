import { useState, useEffect } from 'react'
import { getStoredPassword, storePassword, verifyPassword } from '../api'

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(false)
  const [checked, setChecked] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  // 页面首次加载时，如果本次会话之前已经验证过密码，直接放行
  useEffect(() => {
    const stored = getStoredPassword()
    if (!stored) {
      setChecked(true)
      return
    }
    verifyPassword(stored).then((ok) => {
      setUnlocked(ok)
      setChecked(true)
    })
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    const ok = await verifyPassword(input)
    setBusy(false)
    if (ok) {
      storePassword(input)
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  if (!checked) return null
  if (unlocked) return children

  return (
    <div className="gate">
      <form className="gate-card" onSubmit={handleSubmit}>
        <h1 className="gate-title">我们家的日记本</h1>
        <p className="gate-subtitle">只有一家人知道的密码</p>
        <input
          type="password"
          autoFocus
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setError(false)
          }}
          placeholder="输入密码"
          className="gate-input"
        />
        {error && <p className="gate-error">密码不对，再试一次</p>}
        <button type="submit" className="gate-button" disabled={busy}>
          {busy ? '核对中…' : '进门'}
        </button>
      </form>
    </div>
  )
}
