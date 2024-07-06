import { vec2 } from '@erikwatson/bramble'
import { lerp, random } from '../math'
import { Snowflake } from '../types'

export function addWind(snowflake: Snowflake, wind: any) {
  const w = vec2.create(0, 0)

  w.x = wind.x
  w.y = wind.y

  w.multiplyScalar(snowflake.size + snowflake.random)
  snowflake.pos.add(w)
}

export function addGravity(snowflake: Snowflake, gravity: any) {
  const g = vec2.create(0, 0)

  g.x = gravity.x
  g.y = gravity.y

  g.multiplyScalar(snowflake.size + snowflake.random)
  snowflake.pos.add(g)
}

export function addWaveMotion(snowflake: Snowflake, wave: any, dt: number) {
  const phase = snowflake.noise
  const xPos = wave.amplitude * Math.sin(wave.frequency * dt + phase)

  let sine = vec2.create(xPos, 0)
  snowflake.pos.add(sine)
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
  if (snowflake.pos.x - snowflake.renderedSize > width) {
    snowflake.pos.x = -snowflake.renderedSize
  }

  if (snowflake.pos.x < -snowflake.renderedSize) {
    snowflake.pos.x = width + snowflake.renderedSize
  }

  if (snowflake.pos.y - snowflake.renderedSize > height) {
    snowflake.pos.y = -snowflake.renderedSize
    snowflake.pos.x = random(width)
  }

  if (snowflake.pos.y < -snowflake.renderedSize) {
    snowflake.pos.y = height + snowflake.renderedSize
    snowflake.pos.x = random(width)
  }
}
