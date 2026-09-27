import { useState } from 'react'

// 第一阶段：评论存在本地 state 里，刷新会丢失。
// 第三阶段接入 Giscus 后，这个组件会被替换成 Giscus 的嵌入 iframe。
export default function Comments({ initialComments }) {
  const [comments, setComments] = useState(initialComments)
  const [draft, setDraft] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setComments([...comments, { author: '我', text }])
    setDraft('')
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
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="说点什么…"
          className="comment-input"
        />
        <button type="submit" className="comment-submit">
          发送
        </button>
      </form>
    </div>
  )
}
