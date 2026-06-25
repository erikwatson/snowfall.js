import { Vec2, vec2 } from '@erikwatson/bramble'
import { lerp, random, rotate } from '../math'
import { Snowflake } from '../types'

const { vec2FromDegrees } = vec2

export function addWind(snowflake: Snowflake, angle: number, strength: number) {
  const w = vec2.create(0, 0)
  const windVec = vec2FromDegrees(angle)
  windVec.multiplyScalar(strength)

  w.x = windVec.x
  w.y = windVec.y

  w.multiplyScalar(snowflake.mass + snowflake.random)
  snowflake.position.add(w)
}

export function addRotation(snowflake: Snowflake, dt: number) {
  const vx = (snowflake.position.x - snowflake.previousPosition.x) / dt
  const rotationFactor = 0.0075 // TODO: expose this
  snowflake.rotation += vx * rotationFactor
}

export function addGravity(
  snowflake: Snowflake,
  angle: number,
  strength: number
) {
  const g = vec2.create(0, 0)
  const gravityVec = vec2FromDegrees(angle)
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

export function addScrollMotion(
  position: Vec2,
  deltaX: number,
  deltaY: number
) {
  position.x += deltaX
  position.y += deltaY
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
  return (
    isInBoundsHorizontal(snowflake, screenWidth) &&
    isInBoundsVertical(snowflake, screenHeight)
  )
}

function grow(
  snowflake: Snowflake,
  gravity: { strength: number; angle: number },
  prevPos: Vec2
) {
  const currentPos = vec2.clone(snowflake.position)
  const delta = vec2.clone(currentPos)
  delta.subtract(prevPos)
  const gravityDir = vec2FromDegrees(gravity.angle)
  const upDir = vec2.create(-gravityDir.x, -gravityDir.y)
  const dotProduct = delta.dot(upDir)
  if (dotProduct > 0) {
    snowflake.renderedSize = lerp(snowflake.renderedSize, snowflake.size, 0.25)
  }
}

function isInBoundsHorizontal(snowflake: Snowflake, screenWidth: number) {
  const result =
    snowflake.position.x + snowflake.renderedSize >= 0 &&
    snowflake.position.x - snowflake.renderedSize <= screenWidth

  return result
}

function isInBoundsVertical(snowflake: Snowflake, screenHeight: number) {
  const result =
    snowflake.position.y + snowflake.renderedSize >= 0 &&
    snowflake.position.y - snowflake.renderedSize <= screenHeight

  return result
}

function wrapX(snowflake: Snowflake, width: number, height: number) {
  if (snowflake.position.x + snowflake.renderedSize < 0) {
    snowflake.position.x += width + 2 * snowflake.renderedSize
    snowflake.position.y = random(height)
  } else if (snowflake.position.x - snowflake.renderedSize > width) {
    snowflake.position.x -= width + 2 * snowflake.renderedSize
    snowflake.position.y = random(height)
  }
}

function wrapY(snowflake: Snowflake, height: number, width: number) {
  if (snowflake.position.y + snowflake.renderedSize < 0) {
    snowflake.position.y += height + 2 * snowflake.renderedSize
    snowflake.position.x = random(width)
  } else if (snowflake.position.y - snowflake.renderedSize > height) {
    snowflake.position.y -= height + 2 * snowflake.renderedSize
    snowflake.position.x = random(width)
  }
}

export function screenWrap(
  snowflake: Snowflake,
  width: number,
  height: number
) {
  let wrapped = false
  if (!isInBoundsHorizontal(snowflake, width)) {
    wrapX(snowflake, width, height)
    wrapped = true
  }

  if (!isInBoundsVertical(snowflake, height)) {
    wrapY(snowflake, height, width)
    wrapped = true
  }

  return wrapped
}
