import Comments from './Comments'

const typeLabel = {
  photo: '照片',
  video: '视频',
  post: '文字',
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

export default function Entry({ entry, onCommented }) {
  return (
    <article className="entry">
      <div className="entry-meta">
        <time className="entry-date">{formatDate(entry.date)}</time>
        <span className="entry-type">{typeLabel[entry.type] || '文字'}</span>
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
