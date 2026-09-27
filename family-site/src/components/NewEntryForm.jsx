import { useState, useRef } from 'react'
import { uploadFile, createEntry } from '../api'

export default function NewEntryForm({ onPublished }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  function handleFileChange(e) {
    setFiles(Array.from(e.target.files || []))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setBusy(true)
    setError('')
    try {
      const mediaKeys = []
      for (const file of files) {
        const { key, kind } = await uploadFile(file)
        mediaKeys.push({ key, kind })
      }

      const hasVideo = mediaKeys.some((m) => m.kind === 'video')
      const type = mediaKeys.length === 0 ? 'post' : hasVideo ? 'video' : 'photo'

      await createEntry({ title, body, type, mediaKeys })

      setTitle('')
      setBody('')
      setFiles([])
      if (fileInputRef.current) fileInputRef.current.value = ''
      setOpen(false)
      onPublished()
    } catch (err) {
      setError('发布失败，再试一次')
    } finally {
      setBusy(false)
    }
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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileChange}
        className="new-entry-file"
      />
      {files.length > 0 && (
        <p className="new-entry-hint">已选 {files.length} 个文件</p>
      )}
      {error && <p className="gate-error">{error}</p>}
      <div className="new-entry-actions">
        <button
          type="button"
          className="new-entry-cancel"
          onClick={() => setOpen(false)}
          disabled={busy}
        >
          取消
        </button>
        <button type="submit" className="new-entry-submit" disabled={busy}>
          {busy ? '发布中…' : '发布'}
        </button>
      </div>
    </form>
  )
}
