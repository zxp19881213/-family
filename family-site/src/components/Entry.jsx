import { useState } from 'react'
import Comments from './Comments'
import { deleteEntry } from '../api'

const typeLabel = {
  photo: '照片',
  video: '视频',
  post: '文字',
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

export default function Entry({ entry, onCommented, onDeleted }) {
  const [busy, setBusy] = useState(false)

  async function handleDelete() {
    if (!confirm(`确定要删除「${entry.title}」这条日记吗？删了就找不回来了。`)) {
      return
    }
    setBusy(true)
    try {
      await deleteEntry(entry.id)
      onDeleted && onDeleted()
    } catch (err) {
      alert('删除失败，再试一次')
      setBusy(false)
    }
  }

  return (
    <article className="entry">
      <div className="entry-meta">
        <time className="entry-date">{formatDate(entry.date)}</time>
        <span className="entry-type">{typeLabel[entry.type] || '文字'}</span>
        <button
          className="entry-delete"
          onClick={handleDelete}
          disabled={busy}
          title="删除这条日记"
        >
          {busy ? '删除中…' : '删除'}
        </button>
      </div>
      <h2 className="entry-title">{entry.title}</h2>
      {entry.body && <p className="entry-body">{entry.body}</p>}

      {entry.media && entry.media.length > 0 && (
        <div className="entry-media-grid">
          {entry.media.map((m, i) =>
            m.kind === 'video' ? (
              <video key={i} className="media-real" src={m.url} controls />
            ) : (
              <img key={i} className="media-real" src={m.url} alt="" />
            )
          )}
        </div>
      )}

      <Comments
        entryId={entry.id}
        initialComments={entry.comments || []}
        onCommented={onCommented}
      />
    </article>
  )
}
