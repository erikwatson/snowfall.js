import { Graphics, Vec2, game, vec2 } from '@erikwatson/bramble'
import { getDegreesFromVec2, random } from './math'
import {
  addWind,
  addGravity,
  addWaveMotion,
  screenWrap,
  fadeIn,
  drawLayer
} from './snowflake'
import { Config, Snowflake, UserConfig } from './types'
import { merge } from './config'

const simulation = game.create()
const bgSize = 7 // size threshold for background layer snowflakes
let snowflakes: Snowflake[] = []
let foregroundLayer: Snowflake[]
let backgroundLayer: Snowflake[]
let paused = false
let gravity: Vec2
let wind: Vec2
let config: Config

export function start(userConfig: UserConfig = {}) {
  config = merge(userConfig)
  const { wind, gravity, attachTo } = config

  if (!attachTo) {
    console.error(
      'Unable to start the application, the specified container could not be found.'
    )
    return
  }

  setWind(wind.angle, wind.strength)
  setGravity(gravity.angle, gravity.strength)
  makeSnowflakes(requiredSnowflakes())

  window.onresize = onResize

  simulation.attachTo(attachTo)
  simulation.setSize(attachTo.offsetWidth, attachTo.offsetHeight)
  simulation.setUpdate(dt => update(dt))
  simulation.setRender(gfx => render(gfx))
  simulation.start()
}

export function update(dt: number) {
  const { attachTo, wave, gravity, wind } = config

  snowflakes.forEach(snowflake => {
    addWind(snowflake, wind.angle, wind.strength)
    addGravity(snowflake, gravity.angle, gravity.strength)
    addWaveMotion(snowflake, wave, dt)
    screenWrap(snowflake, attachTo.offsetWidth, attachTo.offsetHeight)
    fadeIn(snowflake)
  })
}

export function render(gfx: Graphics) {
  const { background, primary, secondary } = config

  gfx.clear(background)
  drawLayer(gfx, backgroundLayer, primary)
  drawLayer(gfx, foregroundLayer, secondary)
}

export function onResize() {
  simulation.setSize(config.attachTo.offsetWidth, config.attachTo.offsetHeight)
  makeSnowflakes(requiredSnowflakes())
}

export function makeSnowflakes(num: number) {
  const result = Array.from({ length: num }, () => {
    const size = 3 + random() * 5
    const renderedSize = config.fadeIn === true ? 0 : size

    const posX = random(config.attachTo.offsetWidth)
    const posY = random(config.attachTo.offsetHeight)
    const position = vec2.create(posX, posY)

    return {
      position,
      size,
      renderedSize,
      noise: random(10), // Random value, just to add some uncertainty
      amplitude: random(config.wave.amplitude),
      frequency: random(config.wave.frequency),
      random: random()
    }
  })

  snowflakes = result
  foregroundLayer = snowflakes.filter(x => x.size >= bgSize)
  backgroundLayer = snowflakes.filter(x => x.size < bgSize)
}

// This function figures out how many snowflakes we should use for our given
// canvas size.
//
// Just setting a fixed number of snowflakes would give an uneven distribution
// of snowflakes across different screen sizes, for example.
export function requiredSnowflakes() {
  const tenEightyPee = 1920 * 1080
  const thisScreen = config.attachTo.offsetWidth * config.attachTo.offsetHeight
  const snowflakeCount = Math.round(
    config.density * (thisScreen / tenEightyPee)
  )

  return snowflakeCount
}

export function restart() {
  makeSnowflakes(requiredSnowflakes())
}

export function setBackground(col: string) {
  config.background = col
}

export function setPrimary(col: string) {
  config.primary = col
}

export function setSecondary(col: string) {
  config.secondary = col
}

export function setDensity(den: number) {
  config.density = den
  restart()
}

export function setFade(val: boolean) {
  config.fadeIn = val
  restart()
}

export function setAmplitude(num: number) {
  config.wave.amplitude = num
}

export function setFrequency(freq: number) {
  config.wave.frequency = freq
}

export function setPaused(pause: boolean) {
  paused = pause
}

export function togglePaused() {
  paused = !paused
}

export function setWind(degrees: number, strength: number) {
  config.wind.angle = degrees
  config.wind.strength = strength

  wind = vec2.fromDegrees(degrees)
  wind.multiplyScalar(strength)
}

export function setWindAngle(degrees: number) {
  config.wind.angle = degrees

  const strength = wind.getLength()
  wind = vec2.fromDegrees(degrees)
  wind.multiplyScalar(strength)
}

export function setWindStrength(strength: number) {
  config.wind.strength = strength

  const degrees = getDegreesFromVec2(wind)
  wind = vec2.fromDegrees(degrees)
  wind.multiplyScalar(strength)
}

export function setGravity(degrees: number, strength: number) {
  config.gravity.angle = degrees
  config.gravity.strength = strength

  gravity = vec2.fromDegrees(degrees)
  gravity.multiplyScalar(strength)
}

export function setGravityAngle(degrees: number) {
  config.gravity.angle = degrees

  const strength = gravity.getLength()
  gravity = vec2.fromDegrees(degrees)
  gravity.multiplyScalar(strength)
}

export function setGravityStrength(strength: number) {
  config.gravity.strength = strength

  const degrees = getDegreesFromVec2(gravity)
  gravity = vec2.fromDegrees(degrees)
  gravity.multiplyScalar(strength)
}
