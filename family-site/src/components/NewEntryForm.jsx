import { useState } from 'react'

// 第一阶段：表单能填，提交后把新条目加到页面顶部（不会保存到任何地方，
// 刷新页面就消失）。第二阶段接入 R2/D1 后，提交会真正上传文件、写入数据库。
export default function NewEntryForm({ onAdd }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({
      id: `local-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      type: 'post',
      title,
      body,
      media: [],
      comments: [],
    })
    setTitle('')
    setBody('')
    setOpen(false)
  }

  if (!open) {
    return (
      <button className="new-entry-toggle" onClick={() => setOpen(true)}>
        + 写一条新日记
      </button>
    )
  }

  return (
    <form className="new-entry-form" onSubmit={handleSubmit}>
      <input
        className="new-entry-title"
        placeholder="标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <textarea
        className="new-entry-body"
        placeholder="今天发生了什么？"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
      />
      <p className="new-entry-hint">
        照片/视频上传功能会在接入 Cloudflare R2 后加上
      </p>
      <div className="new-entry-actions">
        <button type="button" className="new-entry-cancel" onClick={() => setOpen(false)}>
          取消
        </button>
        <button type="submit" className="new-entry-submit">
          发布
        </button>
      </div>
    </form>
  )
}
