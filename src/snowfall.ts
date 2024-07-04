/**
 * @module snowfall
 */

import { Vec2, game, vec2 } from '@erikwatson/bramble'
import { lerp, random } from './math'
import { Config, Snowflake, UserConfig } from './types'
import { merge } from './config'

let snowflakes: Snowflake[] = []
let paused = false
let gravity: Vec2
let wind: Vec2
let snowfallConfig: Config
const brambleGame = game.create()

/**
 * @param {Object} config - A config, possibly from the Visual Config Editor.
 * @param {Object} config.attachTo - A HTML element that you want to attach
 * snowfall to. If left blank, this defaults to #snowfall.
 * @param {string} [config.bg = '#0d0014'] - A hex string representing the
 * Background Colour of the canvas.
 * @param {string} [config.primary = '#8d90b7'] - A hex string representing the
 * colour of the snowflakes in the foreground.
 * @param {string} [config.secondary = '#ffffff'] - A hex string representing
 * the colour of the snowflakes in the background.
 * @param {number} [config.density = 200] - A number representing the required
 * density of snowflakes on screen. Note, this is not the actual number of
 * snowflakes.
 * @param {Boolean} [config.fadeIn = false] - Should the snowflakes grow in size
 * when the app starts or should they begin at their full size?
 * @param {Boolean} [config.scroll = false] - Should the snowflakes scroll when
 * the user scrolls up and down the page?
 *
 * @param {Object} config.wave - Configure the wave motion of the snowflakes.
 * @param {number} [config.wave.frequency = 0.02] - The frequency of the wave
 * the snowflakes follow.
 * @param {number} [config.wave.amplitude = 1.0] - The amplitude of the wave the
 * snowflakes follow.
 *
 * @param {Object} config.gravity - Configure the gravity of the simulation.
 * @param {number} [config.gravity.angle = 90] - The angle of gravity, in
 * degrees.
 * @param {number} [config.gravity.strength = 0.7] - The strength of gravity.
 *
 * @param {Object} config.wind - Configure the wind.
 * @param {number} [config.wind.angle = 0] - The angle of the wind, in degrees.
 * @param {number} [config.wind.strength = 0] - The strength of the wind.
 */
function start(config: UserConfig = {}) {
  config = merge(config)
  snowfallConfig = config as Config

  if (!config.attachTo) {
    console.error(
      'Unable to start the application, the specified container could not be found.'
    )
    return
  }

  setWind(snowfallConfig.wind.angle, snowfallConfig.wind.strength)
  setGravity(snowfallConfig.gravity.angle, snowfallConfig.gravity.strength)

  snowflakes = makeSnowflakes(requiredSnowflakes())
  window.onresize = onResize

  brambleGame.attachTo(config.attachTo)
  brambleGame.setSize(config.attachTo.offsetWidth, config.attachTo.offsetHeight)

  const w = vec2.create(0, 0)
  const g = vec2.create(0, 0)

  brambleGame.setUpdate(dt => {
    snowflakes.forEach(snowflake => {
      // add the wind
      w.x = wind.x
      w.y = wind.y

      w.multiplyScalar(snowflake.size + snowflake.random)
      snowflake.pos.add(w)

      // add gravity
      g.x = gravity.x
      g.y = gravity.y

      g.multiplyScalar(snowflake.size + snowflake.random)
      snowflake.pos.add(g)

      // add the wave motion
      const phase = snowflake.noise
      const xPos =
        snowfallConfig.wave.amplitude *
        Math.sin(snowfallConfig.wave.frequency * dt + phase)

      let sine = vec2.create(xPos, 0)
      snowflake.pos.add(sine)

      // wrap the snowflakes when they move off screen
      if (
        snowflake.pos.x - snowflake.renderedSize >
        (snowfallConfig.attachTo?.offsetWidth || 0)
      ) {
        snowflake.pos.x = -snowflake.renderedSize
      }

      if (snowflake.pos.x < -snowflake.renderedSize) {
        snowflake.pos.x =
          (snowfallConfig.attachTo?.offsetWidth || 0) + snowflake.renderedSize
      }

      if (
        snowflake.pos.y - snowflake.renderedSize >
        (snowfallConfig.attachTo?.offsetHeight || 0)
      ) {
        snowflake.pos.y = snowflake.renderedSize
        snowflake.pos.x = random(snowfallConfig.attachTo?.offsetWidth || 0)
      }

      if (snowflake.pos.y < -snowflake.renderedSize) {
        snowflake.pos.y =
          (snowfallConfig.attachTo?.offsetHeight || 0) + snowflake.renderedSize
        snowflake.pos.x = random(snowfallConfig.attachTo?.offsetWidth || 0)
      }

      if (snowflake.renderedSize < snowflake.size) {
        snowflake.renderedSize = lerp(
          snowflake.renderedSize,
          snowflake.size,
          0.025
        )
      }
    })
  })

  brambleGame.setRender(gfx => {
    const bgSize = 7
    const foreground = snowflakes.filter(x => x.size >= bgSize)
    const background = snowflakes.filter(x => x.size < bgSize)

    gfx.clear(snowfallConfig.background)

    background.forEach(snowflake => {
      gfx.circle(snowflake.pos, snowflake.renderedSize, {
        fill: {
          colour: snowfallConfig.primary
        },
        line: {
          width: 0
        }
      })
    })

    foreground.forEach(snowflake => {
      gfx.circle(snowflake.pos, snowflake.renderedSize, {
        fill: {
          colour: snowfallConfig.secondary
        },
        line: {
          width: 0
        }
      })
    })
  })

  brambleGame.start()
}

/**
 * Set the background colour
 *
 * @param {string} colour - The background colour of the Canvas
 */
function setBackground(col: string) {
  snowfallConfig.background = col
}

/**
 * Sets the colour of the Snowflakes in the foreground
 *
 * @param {string} colour - A Hex string representing the colour of the
 *                          foreground snow.
 */
function setPrimary(col: string) {
  snowfallConfig.primary = col
}

/**
 * Sets the colour of the Snowflakes in the background
 *
 * @param {string} colour - A Hex string representing the colour of the
 *                          background snow.
 */
function setSecondary(col: string) {
  snowfallConfig.secondary = col
}

/**
 * Set the density of the Snowflakes. This is the number of snowflakes on screen
 * at a resolution of 1280 x 1080, but this number is scaled up and down at
 * higher and lower resolutions respectively to give a consistent look when
 * resizing.
 *
 * Setting this restarts the simulation.
 *
 * @param {number} density - A number representing the density of snowflakes.
 */
function setDensity(den: number) {
  snowfallConfig.density = den
  restart()
}

/**
 * Should the snowflakes grow in size from nothing until they reach their full
 * size? It happens pretty quickly.
 *
 * Setting this restarts the simulation.
 *
 * @param {Boolean} value - Yes or no?
 */
function setFade(val: boolean) {
  snowfallConfig.fadeIn = val
  restart()
}

/**
 * Should the snowflakes scroll up and down the page as the User scrolls?
 * @param {Boolean} value - Yes or no?
 */
function setScroll(val: boolean) {
  snowfallConfig.scroll = val
}

/**
 * Set the Amplitude of the Wave motion of the Snowflakes
 *
 * @param {number} amplitude - The Amplitude to set
 */
function setAmplitude(num: number) {
  snowfallConfig.wave.amplitude = num
}

/**
 * Set the Frequency of the Wave motion of the Snowflakes.
 *
 * @param {number} frequency - The frequency to set
 */
function setFrequency(freq: number) {
  snowfallConfig.wave.frequency = freq
}

/**
 * Set the angle and strength of gravity in the simulation.
 *
 * @param {number} angle - The angle of gravity, in degrees
 * @param {number} strength - The strength of the gravity
 */
function setGravity(degrees: number, strength: number) {
  console.log({ degrees, strength })
  gravity = vec2.fromDegrees(degrees)
  gravity.multiplyScalar(strength)
}

/**
 * Set the angle and strength of the wind in the simulation.
 *
 * @param {number} angle - The angle of the wind, in degrees
 * @param {number} strength - The strength of the wind
 */
function setWind(degrees: number, strength: number) {
  wind = vec2.fromDegrees(degrees)
  wind.multiplyScalar(strength)
}

/**
 * Set this to true to prevent the update.
 * Set it to true to continue from where we left off.
 *
 * @param {boolean} pause - If the simulation should be halted or not
 */
function setPaused(pause: boolean) {
  paused = pause
}

/**
 * Pause/unpause the snowfall update loop
 */
function togglePaused() {
  paused = !paused
}

function onResize() {
  brambleGame.setSize(
    snowfallConfig.attachTo!.offsetWidth,
    snowfallConfig.attachTo!.offsetHeight
  )
  snowflakes = makeSnowflakes(requiredSnowflakes())
}

function makeSnowflakes(num: number): Snowflake[] {
  return Array.from({ length: num }, () => {
    const size = 3 + random() * 5
    const renderedSize = snowfallConfig.fadeIn === true ? 0 : size

    return {
      pos: vec2.create(
        random(snowfallConfig.attachTo?.offsetWidth || 0),
        random(snowfallConfig.attachTo?.offsetHeight || 0)
      ),
      size,
      renderedSize,
      noise: random(10), // Random value, just to add some uncertainty
      amplitude: random(snowfallConfig.wave.amplitude),
      frequency: random(snowfallConfig.wave.frequency),
      random: random()
    }
  })
}

// This function figures out how many snowflakes we should use for our given
// canvas size.
//
// Just setting a fixed number of snowflakes would give an uneven distribution
// of snowflakes across different screen sizes, for example.
function requiredSnowflakes() {
  const tenEightyPee = 1920 * 1080
  const thisScreen =
    (snowfallConfig.attachTo?.offsetWidth || 0) *
    (snowfallConfig.attachTo?.offsetHeight || 0)
  const snowflakeCount = Math.round(
    snowfallConfig.density * (thisScreen / tenEightyPee)
  )

  return snowflakeCount
}

function restart() {
  snowflakes = makeSnowflakes(requiredSnowflakes())
}

;(window as any).snowfall = {
  setAmplitude,
  setBackground,
  setDensity,
  setFade,
  setFrequency,
  setGravity,
  setPaused,
  setPrimary,
  setScroll,
  setSecondary,
  setWind,
  start,
  togglePaused
}
