// 在浏览器里用 canvas 把大图缩小、转成 JPEG 再上传，
// 明显减少上传时间，也不容易撞到服务器的大小限制。
// 只处理图片，视频原样保留（浏览器压缩视频太复杂，不划算）。

const MAX_DIMENSION = 1600
const JPEG_QUALITY = 0.82

export async function compressImageIfNeeded(file) {
  if (!file.type.startsWith('image/')) return file
  // gif 有动画，压缩会破坏动图效果，跳过
  if (file.type === 'image/gif') return file

  try {
    const bitmap = await createImageBitmap(file)
    const { width, height } = bitmap

    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height))
    const targetWidth = Math.round(width * scale)
    const targetHeight = Math.round(height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight)

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
    )

    // 极少数情况下压缩失败或压完反而更大，就用原图
    if (!blob || blob.size >= file.size) return file

    const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg'
    return new File([blob], newName, { type: 'image/jpeg' })
  } catch (err) {
    // 浏览器不认识这个格式（比如某些 HEIC 情况）就直接传原图，
    // 不能因为压缩失败就让整个发布卡住
    console.warn('图片压缩失败，改用原图上传', err)
    return file
  }
}
