import { useEffect, useCallback } from 'react'

export default function Lightbox({ images, index, onClose, onNavigate }) {
  const hasMultiple = images.length > 1

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && hasMultiple) {
        onNavigate((index + 1) % images.length)
      }
      if (e.key === 'ArrowLeft' && hasMultiple) {
        onNavigate((index - 1 + images.length) % images.length)
      }
    },
    [index, images.length, hasMultiple, onClose, onNavigate]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="关闭">
        ✕
      </button>

      {hasMultiple && (
        <button
          className="lightbox-nav lightbox-prev"
          onClick={(e) => {
            e.stopPropagation()
            onNavigate((index - 1 + images.length) % images.length)
          }}
          aria-label="上一张"
        >
          ‹
        </button>
      )}

      <img
        className="lightbox-image"
        src={images[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
      />

      {hasMultiple && (
        <button
          className="lightbox-nav lightbox-next"
          onClick={(e) => {
            e.stopPropagation()
            onNavigate((index + 1) % images.length)
          }}
          aria-label="下一张"
        >
          ›
        </button>
      )}

      {hasMultiple && (
        <div className="lightbox-counter">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  )
}
