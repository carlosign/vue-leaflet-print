export function printNative(map: any) {
  if (!map) throw new Error('Map instance is required')
  map.invalidateSize()
  window.print()
}
