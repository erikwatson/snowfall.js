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

// TODO: Move this to Vec2 in Bramble
export function getDegreesFromVec2(vec: Vec2) {
  const radians = Math.atan2(vec.x, vec.y)
  const degrees = radians * (180 / Math.PI)

  return degrees
}

// TODO: Move this to Vec2 in Bramble
export function rotate(vec: Vec2, angleDegrees: number): Vec2 {
  const angleRadians = angleDegrees * (Math.PI / 180)
  const cos = Math.cos(angleRadians)
  const sin = Math.sin(angleRadians)

  const newX = vec.x * cos - vec.y * sin
  const newY = vec.x * sin + vec.y * cos

  vec.x = newX
  vec.y = newY

  return vec
}
