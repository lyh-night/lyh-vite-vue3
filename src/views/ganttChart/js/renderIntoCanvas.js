// canvas render

export const BG_COLOR = '#fff'
export const MIN_ITEM_HEIGHT = 2
export const MAX_TOTAL_HEIGHT = 200
export const MIN_ITEM_WIDTH = 10
export const MIN_TOTAL_HEIGHT = 60
export const MAX_ITEM_HEIGHT = 6

/**
  canvas: HTMLCanvasElement,
  items: { valueWidth: number; valueOffset: number; fillBackgroundColor: string }[],
  totalValueWidth: number,
 */
export default function renderIntoCanvas(canvas, items, totalValueWidth) {
  const fillCache = new Map()
  const cHeight = items.length < MIN_TOTAL_HEIGHT ? MIN_TOTAL_HEIGHT : Math.min(items.length, MAX_TOTAL_HEIGHT)
  const cWidth = window.innerWidth * 2
  canvas.width = cWidth
  canvas.height = cHeight
  const itemHeight = Math.min(MAX_ITEM_HEIGHT, Math.max(MIN_ITEM_HEIGHT, cHeight / items.length))
  const itemYChange = cHeight / items.length

  const ctx = canvas.getContext('2d', { alpha: false })
  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, cWidth, cHeight)
  for (let i = 0; i < items.length; i++) {
    const { valueWidth, valueOffset, fillBackgroundColor = BG_COLOR } = items[i]
    const x = (valueOffset / totalValueWidth) * cWidth
    let width = (valueWidth / totalValueWidth) * cWidth
    if (width < MIN_ITEM_WIDTH) {
      width = MIN_ITEM_WIDTH
    }
    ctx.fillStyle = fillBackgroundColor
    ctx.fillRect(x, i * itemYChange, width, itemHeight)
  }
}
