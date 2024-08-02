// color

const COLORS_HEX = [
  '#17B8BE',
  '#F8DCA1',
  '#B7885E',
  '#FFCB99',
  '#F89570',
  '#829AE3',
  '#E79FD5',
  '#1E96BE',
  '#89DAC1',
  '#B3AD9E',
  '#12939A',
  '#DDB27C',
  '#88572C',
  '#FF9833',
  '#EF5D28',
  '#162A65',
  '#DA70BF',
  '#125C77',
  '#4DC19C',
  '#776E57'
]

function strToRgb(s) {
  if (s.length !== 7) {
    return [0, 0, 0]
  }
  const r = s.slice(1, 3)
  const g = s.slice(3, 5)
  const b = s.slice(5)
  return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)]
}

export class ColorGenerator {
  constructor(colorsHex = COLORS_HEX) {
    this.colorsHex = colorsHex
    this.colorsRgb = colorsHex.map(strToRgb)
    this.cache = new Map()
    this.currentIdx = 0
  }

  _getColorIndex(key) {
    let i = this.cache.get(key)
    if (i == null) {
      i = this.currentIdx
      this.cache.set(key, this.currentIdx)
      this.currentIdx = ++this.currentIdx % this.colorsHex.length
    }
    return i
  }

  getColorByKey(key) {
    const i = this._getColorIndex(key)
    return this.colorsHex[i]
  }

  getRgbColorByKey(key) {
    const i = this._getColorIndex(key)
    return this.colorsRgb[i]
  }

  clear() {
    this.cache.clear()
    this.currentIdx = 0
  }
}

export default new ColorGenerator()
