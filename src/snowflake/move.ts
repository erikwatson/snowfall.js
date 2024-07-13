import { Vec2, vec2 } from '@erikwatson/bramble'
import { lerp, random } from '../math'
import { Snowflake } from '../types'

export function addWind(snowflake: Snowflake, angle: number, strength: number) {
  const w = vec2.create(0, 0)
  const windVec = vec2.fromDegrees(angle)
  windVec.multiplyScalar(strength)

  w.x = windVec.x
  w.y = windVec.y

  w.multiplyScalar(snowflake.size + snowflake.random)
  snowflake.position.add(w)
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

  g.multiplyScalar(snowflake.size + snowflake.random)
  snowflake.position.add(g)
}

export function addWaveMotion(
  snowflake: Snowflake,
  gravity: { angle: number; strength: number },
  wave: { frequency: number; amplitude: number },
  dt: number
) {
  // Calculate the wave motion perpendicular to the gravity vector
  const phase = snowflake.noise
  const xPos = wave.amplitude * Math.sin(wave.frequency * dt + phase)

  // Create the gravity vector
  const g = vec2.create(1, 0) // Assuming gravity direction starts along the x-axis
  rotate(g, gravity.angle)

  // Rotate the sine wave vector by the perpendicular vector's angle
  let sine = vec2.create(xPos, 0)
  rotate(sine, gravity.angle + 90) // Rotate by gravity angle + 90 degrees

  snowflake.position.add(sine)
}

// TODO: Move this to Vec2 in Bramble
function rotate(vec: Vec2, angleDegrees: number): Vec2 {
  const angleRadians = angleDegrees * (Math.PI / 180)
  const cos = Math.cos(angleRadians)
  const sin = Math.sin(angleRadians)

  const newX = vec.x * cos - vec.y * sin
  const newY = vec.x * sin + vec.y * cos

  vec.x = newX
  vec.y = newY

  return vec
}

export function fadeIn(snowflake: Snowflake) {
  if (snowflake.renderedSize < snowflake.size) {
    snowflake.renderedSize = lerp(snowflake.renderedSize, snowflake.size, 0.025)
  }
}

export function screenWrap(
  snowflake: Snowflake,
  width: number,
  height: number
) {
  if (snowflake.position.x - snowflake.renderedSize > width) {
    snowflake.position.x = -snowflake.renderedSize
  }

  if (snowflake.position.x < -snowflake.renderedSize) {
    snowflake.position.x = width + snowflake.renderedSize
  }

  if (snowflake.position.y - snowflake.renderedSize > height) {
    snowflake.position.y = -snowflake.renderedSize
    snowflake.position.x = random(width)
  }

  if (snowflake.position.y < -snowflake.renderedSize) {
    snowflake.position.y = height + snowflake.renderedSize
    snowflake.position.x = random(width)
  }
}
