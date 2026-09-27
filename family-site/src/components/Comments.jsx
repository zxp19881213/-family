import { useState } from 'react'
import { addComment } from '../api'

const AUTHOR_KEY = 'family-journal-author'

export default function Comments({ entryId, initialComments, onCommented }) {
  const [comments, setComments] = useState(initialComments)
  const [draft, setDraft] = useState('')
  const [author, setAuthor] = useState(
    () => localStorage.getItem(AUTHOR_KEY) || ''
  )
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const text = draft.trim()
    const name = author.trim() || '匿名'
    if (!text) return

    setBusy(true)
    localStorage.setItem(AUTHOR_KEY, name)
    try {
      await addComment({ entryId, author: name, text })
      setComments([...comments, { author: name, text }])
      setDraft('')
      onCommented && onCommented()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="comments">
      {comments.length > 0 && (
        <ul className="comment-list">
          {comments.map((c, i) => (
            <li key={i} className="comment-item">
              <span className="comment-author">{c.author}</span>
              <span className="comment-text">{c.text}</span>
            </li>
          ))}
        </ul>
      )}
      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="你的名字"
          className="comment-author-input"
        />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="说点什么…"
          className="comment-input"
        />
        <button type="submit" className="comment-submit" disabled={busy}>
          发送
        </button>
      </form>
    </div>
  )
}
