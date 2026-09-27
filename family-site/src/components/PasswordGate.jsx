import { useState } from 'react'

// 第一阶段：最简单的共享密码保护，密码写在这里（第二阶段可换成
// Cloudflare Pages 的环境变量 + Function 校验，避免前端明文密码）。
const SITE_PASSWORD = 'ourfamily'
const STORAGE_KEY = 'family-journal-unlocked'

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === 'true'
  )
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (input === SITE_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
    }
  }

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
        <button type="submit" className="gate-button">
          进门
        </button>
      </form>
    </div>
  )
}
