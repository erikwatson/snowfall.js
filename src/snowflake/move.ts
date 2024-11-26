import { vec2 } from '@erikwatson/bramble'
import { lerp, random, rotate } from '../math'
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
  const phase = snowflake.time + snowflake.noise
  const xPos = wave.amplitude * Math.sin(wave.frequency * dt + phase)

  // Assuming gravity direction starts along the x-axis
  const g = vec2.create(1, 0)
  rotate(g, gravity.angle)

  // Rotate the sine wave vector by the perpendicular vector's angle
  let sine = vec2.create(xPos, 0)
  rotate(sine, gravity.angle + 90)

  snowflake.position.add(sine)
}

export function fadeIn(snowflake: Snowflake) {
  if (snowflake.renderedSize < snowflake.size) {
    snowflake.renderedSize = lerp(snowflake.renderedSize, snowflake.size, 0.025)
  }
}

export function screenWrap(
  snowflake: Snowflake,
  width: number,
  height: number,
  gravity: {
    angle: number
    strength: number
    respectOrientation: boolean
  }
) {
  const prevPos = vec2.clone(snowflake.position)
  const gravityDir = vec2.fromDegrees(gravity.angle)
  const upDir = vec2.create(-gravityDir.x, -gravityDir.y)

  let moved = false

  if (snowflake.position.x - snowflake.renderedSize > width) {
    snowflake.position.x = -snowflake.renderedSize
    moved = true
  }

  if (snowflake.position.x < -snowflake.renderedSize) {
    snowflake.position.x = width + snowflake.renderedSize
    moved = true
  }

  if (snowflake.position.y - snowflake.renderedSize > height) {
    snowflake.position.y = -snowflake.renderedSize
    snowflake.position.x = random(width)
    moved = true
  }

  if (snowflake.position.y < -snowflake.renderedSize) {
    snowflake.position.y = height + snowflake.renderedSize
    snowflake.position.x = random(width)
    moved = true
  }

  if (moved) {
    const currentPos = vec2.clone(snowflake.position)
    currentPos.subtract(prevPos)

    const dotProduct = currentPos.dot(upDir)

    if (dotProduct > 0) {
      // increase the size of the snowflake
      snowflake.renderedSize = lerp(
        snowflake.renderedSize,
        snowflake.size,
        0.25
      )

      snowflake.colour = 'red'
    }
  }
}
