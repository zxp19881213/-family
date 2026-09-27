// 第一阶段用占位符表示图片/视频的位置和比例。
// 第二阶段接入 Cloudflare R2 后，这里换成真实的 <img> / <video>。
export default function MediaPlaceholder({ kind, placeholder }) {
  return (
    <div className={`media media-${kind}`}>
      <span className="media-icon">{kind === 'video' ? '▶' : '🖼'}</span>
      <span className="media-label">{placeholder}</span>
    </div>
  )
}
