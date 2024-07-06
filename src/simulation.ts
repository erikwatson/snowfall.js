import { Graphics, Vec2, game, vec2 } from '@erikwatson/bramble'
import { random } from './math'
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
  simulation.setUpdate(update)
  simulation.setRender(render)
  simulation.start()
}

export function update(dt: number) {
  const { attachTo, wave, gravity } = config

  snowflakes.forEach(snowflake => {
    addWind(snowflake, wind)
    addGravity(snowflake, gravity)
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

    return {
      pos: vec2.create(
        random(config.attachTo.offsetWidth),
        random(config.attachTo.offsetHeight)
      ),
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

export function setScroll(val: boolean) {
  config.scroll = val
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
  wind = vec2.fromDegrees(degrees)
  wind.multiplyScalar(strength)
}

export function setGravity(degrees: number, strength: number) {
  gravity = vec2.fromDegrees(degrees)
  gravity.multiplyScalar(strength)
}
