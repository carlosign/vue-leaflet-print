import leafletImage from 'leaflet-image'
export async function exportPngLeafletImage(
  map: any,
  opts: { filename?: string; pixelRatio?: number; includeAttribution?: boolean } = {}
) {
  if (!map) throw new Error('Map instance is required')
  map.invalidateSize()
  const a = document.createElement('a')
  const filename = opts.filename || 'map.png'
  await new Promise<void>((resolve, reject) => {
    leafletImage(map, (err: any, canvas: HTMLCanvasElement) => {
      if (err) return reject(err)
      try {
        if (opts.includeAttribution) {
          const ctx = canvas.getContext('2d')!
          const text = '© contributors'
          ctx.font = '12px sans-serif'
          ctx.fillStyle = 'rgba(255,255,255,.85)'
          const pad = 6
          const w = ctx.measureText(text).width + pad * 2
          const h = 20
          ctx.fillRect(canvas.width - w - pad, canvas.height - h - pad, w, h)
          ctx.fillStyle = '#000'
          ctx.fillText(text, canvas.width - w, canvas.height - 9)
        }
        a.href = canvas.toDataURL('image/png')
        a.download = filename
        a.click()
        resolve()
      } catch (e) { reject(e) }
    })
  })
}
