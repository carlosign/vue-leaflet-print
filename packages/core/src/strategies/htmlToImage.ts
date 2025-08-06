import { toPng } from 'html-to-image'
export async function exportPngHtmlToImage(
  map: any,
  opts: { filename?: string; pixelRatio?: number; hide?: string[]; includeAttribution?: boolean } = {}
) {
  if (!map) throw new Error('Map instance is required')
  map.invalidateSize()
  const container: HTMLElement = map.getContainer()
  const cleanup: Array<() => void> = []
  ;(opts.hide || []).forEach((sel) => {
    container.querySelectorAll<HTMLElement>(sel).forEach((el) => {
      const prev = el.style.visibility
      el.style.visibility = 'hidden'
      cleanup.push(() => (el.style.visibility = prev))
    })
  })
  let cloned: HTMLElement | null = null
  if (opts.includeAttribution) {
    const attr = container.querySelector('.leaflet-control-attribution') as HTMLElement | null
    if (attr) {
      cloned = attr.cloneNode(true) as HTMLElement
      Object.assign(cloned.style, { position:'absolute', right:'8px', bottom:'6px',
        background:'rgba(255,255,255,.85)', padding:'2px 6px', borderRadius:'3px' })
      container.appendChild(cloned)
      cleanup.push(() => cloned && cloned.remove())
    }
  }
  try {
    const dataUrl = await toPng(container, {
      cacheBust: true,
      pixelRatio: (window.devicePixelRatio || 1) * (opts.pixelRatio || 2),
      backgroundColor: '#ffffff'
    })
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = opts.filename || 'map.png'
    a.click()
  } finally {
    cleanup.forEach((fn) => fn())
  }
}
