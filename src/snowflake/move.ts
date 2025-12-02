import { Vec2, vec2 } from '@erikwatson/bramble'
import { lerp, random, rotate } from '../math'
import { Snowflake } from '../types'
import { randomInt } from 'crypto'

export function addWind(snowflake: Snowflake, angle: number, strength: number) {
  const w = vec2.create(0, 0)
  const windVec = vec2.fromDegrees(angle)
  windVec.multiplyScalar(strength)

  w.x = windVec.x
  w.y = windVec.y

  w.multiplyScalar(snowflake.mass + snowflake.random)
  snowflake.position.add(w)
}

export function addRotation(snowflake: Snowflake) {
  snowflake.rotation++
}

export function addGravity(
  snowflake: Snowflake,
  angle: number,
  strength: number
) {
  const g = vec2.create(0, 0)
  const gravityVec = vec2.fromDegrees(angle)
  gravityVec.multiplyScalar(strength)

  g.x = gravityVec.x
  g.y = gravityVec.y

  g.multiplyScalar(snowflake.mass + snowflake.random)
  snowflake.position.add(g)
}

export function addSwayMotion(
  snowflake: Snowflake,
  gravity: { angle: number; strength: number },
  sway: { frequency: number; amplitude: number }
) {
  // Calculate the sway motion perpendicular to the gravity vector
  const phase = snowflake.time + snowflake.noise
  const xPos =
    sway.amplitude * Math.sin(sway.frequency * snowflake.time + phase)

  // Assuming gravity direction starts along the x-axis
  const g = vec2.create(1, 0)
  rotate(g, gravity.angle)

  // Rotate the sine sway vector by the perpendicular vector's angle
  let sine = vec2.create(xPos, 0)
  rotate(sine, gravity.angle + 90)

  snowflake.position.add(sine)
}

export function fadeIn(snowflake: Snowflake) {
  if (snowflake.renderedSize < snowflake.mass) {
    snowflake.renderedSize = lerp(snowflake.renderedSize, snowflake.mass, 0.025)
  }
}

// Is the snowflake visible on screen right now?
function isVisible(
  snowflake: Snowflake,
  screenWidth: number,
  screenHeight: number
): boolean {
  const size = snowflake.size // ideally the diagonal length of a square of our size

  const inBoundsHorizontal =
    snowflake.position.x + size >= 0 &&
    snowflake.position.x - size <= screenWidth
  const inBoundsVertical =
    snowflake.position.y + size >= 0 &&
    snowflake.position.y - size <= screenHeight

  return inBoundsHorizontal && inBoundsVertical
}

function grow(
  snowflake: Snowflake,
  gravity: { strength: number; angle: number },
  prevPos: Vec2
) {
  const currentPos = vec2.clone(snowflake.position)
  const delta = vec2.clone(currentPos)
  delta.subtract(prevPos)
  const gravityDir = vec2.fromDegrees(gravity.angle)
  const upDir = vec2.create(-gravityDir.x, -gravityDir.y)
  const dotProduct = delta.dot(upDir)
  if (dotProduct > 0) {
    snowflake.renderedSize = lerp(snowflake.renderedSize, snowflake.size, 0.25)
  }
}

function moveToTop(snowflake: Snowflake, screenWidth: number) {
  snowflake.position.y = -snowflake.size
  snowflake.position.x = random(screenWidth) // deterministic x
}

function moveToBottom(
  snowflake: Snowflake,
  screenWidth: number,
  screenHeight: number
) {
  snowflake.position.y = screenHeight + snowflake.size
  snowflake.position.x = random(screenWidth) // deterministic x
}

function moveToLeft(snowflake: Snowflake, screenHeight: number) {
  snowflake.position.y = random(screenHeight) // deterministic y
  snowflake.position.x = -snowflake.size
}

function moveToRight(
  snowflake: Snowflake,
  screenWidth: number,
  screenHeight: number
) {
  snowflake.position.y = random(screenHeight) // deterministic y
  snowflake.position.x = screenWidth + snowflake.size
}

function moveRandom(
  snowflake: Snowflake,
  screenWidth: number,
  screenHeight: number,
  gravity: { angle: number; strength: number },
  prevPos: Vec2
) {
  // Determine the side moved from (exit side)
  let from_side: string
  if (snowflake.position.y > screenHeight) from_side = 'bottom'
  else if (snowflake.position.y < 0) from_side = 'top'
  else if (snowflake.position.x < 0) from_side = 'left'
  else if (snowflake.position.x > screenWidth) from_side = 'right'
  else from_side = 'bottom'

  // Compute velocity
  const vel = vec2.create(
    snowflake.position.x - prevPos.x,
    snowflake.position.y - prevPos.y
  )

  // Determine moving directions
  const moving_in: string[] = []
  if (vel.x > 0) moving_in.push('right')
  if (vel.x < 0) moving_in.push('left')
  if (vel.y > 0) moving_in.push('bottom')
  if (vel.y < 0) moving_in.push('top')

  // Possible sides to move to
  const sides = ['top', 'bottom', 'left', 'right'].filter(
    s => s !== from_side && !moving_in.includes(s)
  )

  // Choose side using seededRandom
  const chosen = sides[Math.floor(random(0, sides.length))]

  const opposites: Record<string, string> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left'
  }
  const up_side = opposites[from_side]

  // Move to chosen side
  if (chosen === 'top') moveToTop(snowflake, screenWidth)
  else if (chosen === 'bottom')
    moveToBottom(snowflake, screenWidth, screenHeight)
  else if (chosen === 'left') moveToLeft(snowflake, screenHeight)
  else if (chosen === 'right') moveToRight(snowflake, screenWidth, screenHeight)

  // Grow if moving to the "up" side
  if (chosen === up_side) grow(snowflake, gravity, prevPos)
}

export function screenWrap(
  snowflake: Snowflake,
  width: number,
  height: number,
  gravity: { angle: number; strength: number }
) {
  const prevPos = vec2.clone(snowflake.position)
  if (!isVisible(snowflake, width, height)) {
    moveRandom(snowflake, width, height, gravity, prevPos)
  }
}
