import { Vec2 } from '@erikwatson/bramble'

export function lerp(start: number, end: number, alpha: number) {
  return start * (1 - alpha) + end * alpha
}

export function random(): number
export function random(to: number): number
export function random(from: number, to: number): number

export function random(from?: number, to?: number) {
  if (arguments.length === 1) {
    to = from
    from = 0
  }

  if (from === undefined && to === undefined) {
    return Math.random()
  }

  if (from !== undefined && to !== undefined) {
    return from + Math.random() * (to - from)
  }

  // in practice, this return will never be reached
  return 0
}

export function getDegreesFromVec2(vec: Vec2) {
  const radians = Math.atan2(vec.x, vec.y)
  const degrees = radians * (180 / Math.PI)

  return degrees
}
