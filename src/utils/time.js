// 处理时间

import _dropWhile from 'lodash/dropWhile'
import _round from 'lodash/round'

/** @constant 1ms作为微秒数 */
export const ONE_MILLISECOND = 1000 * 1

const ONE_SECOND = 1000 * ONE_MILLISECOND
const ONE_MINUTE = 60 * ONE_SECOND
const ONE_HOUR = 60 * ONE_MINUTE
const ONE_DAY = 24 * ONE_HOUR

const UNIT_STEPS = [
  { unit: 'd', microseconds: ONE_DAY, ofPrevious: 24 },
  { unit: 'h', microseconds: ONE_HOUR, ofPrevious: 60 },
  { unit: 'm', microseconds: ONE_MINUTE, ofPrevious: 60 },
  { unit: 's', microseconds: ONE_SECOND, ofPrevious: 1000 },
  { unit: 'ms', microseconds: ONE_MILLISECOND, ofPrevious: 1000 },
  { unit: 'μs', microseconds: 1, ofPrevious: 1000 }
]

/**
 * @example
 * 5000ms => 5s
 * 1000μs => 1ms
 * 183840s => 2d 3h
 * @param {number} duration - Unix Time
 * @return {string} formatted duration
 */

export function formatDuration(duration) {
  // 删除除最后一个单元外的所有太大的单元
  const [primaryUnit, secondaryUnit] = _dropWhile(
    UNIT_STEPS,
    ({ microseconds }, index) => index < UNIT_STEPS.length - 1 && microseconds > duration
  )

  if (primaryUnit.ofPrevious === 1000) {
    // 如果单位是十进制的，则显示为十进制
    return `${_round(duration / primaryUnit.microseconds, 2)}${primaryUnit.unit}`
  }

  const primaryValue = Math.floor(duration / primaryUnit.microseconds)
  const primaryUnitString = `${primaryValue}${primaryUnit.unit}`
  const secondaryValue = Math.round((duration / secondaryUnit.microseconds) % primaryUnit.ofPrevious)
  const secondaryUnitString = `${secondaryValue}${secondaryUnit.unit}`
  return secondaryValue === 0 ? primaryUnitString : `${primaryUnitString} ${secondaryUnitString}`
}
