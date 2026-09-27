import MediaPlaceholder from './MediaPlaceholder'
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

export default function Entry({ entry }) {
  return (
    <article className="entry">
      <div className="entry-meta">
        <time className="entry-date">{formatDate(entry.date)}</time>
        <span className="entry-type">{typeLabel[entry.type]}</span>
      </div>
      <h2 className="entry-title">{entry.title}</h2>
      <p className="entry-body">{entry.body}</p>

      {entry.media.length > 0 && (
        <div className="entry-media-grid">
          {entry.media.map((m, i) => (
            <MediaPlaceholder key={i} kind={m.kind} placeholder={m.placeholder} />
          ))}
        </div>
      )}

      <Comments initialComments={entry.comments} />
    </article>
  )
}
