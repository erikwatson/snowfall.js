/**
 * @module snowfall
 */

const vec2 = require('./vec2')

const appContainer = document.querySelector('#snow-container')

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

let gravity = vec2.create(0, 0.7)
let wind = vec2.create(0, 0)
let density = 200

let snowflakes = []

let bg = '#0d0014'
let primary = '#8d90b7'
let secondary = '#ffffff'

let amplitude = 1.0
let frequency = 0.02

/**
 * @param {Object} config - A config, possibly from the Visual Config Editor.
 * @param {string} config.bg - A hex string representing the Background Colour
 * of the canvas.
 * @param {string} config.primary - A hex string representing the colour of the
 * snowflakes in the foreground.
 * @param {string} config.secondary - A hex string representing the colour of
 * the snowflakes in the background.
 * @param {number} config.density - A number representing the required density
 * of snowflakes on screen. Note, this is not the actual number of snowflakes.
 *
 * @param {Object} config.wave - Configure the wave motion of the snowflakes.
 * @param {number} config.wave.frequency - The frequency of the wave the
 * snowflakes follow.
 * @param {number} config.wave.amplitude - The amplitude of the wave the
 * snowflakes follow.
 *
 * @param {Object} config.gravity - Configure the gravity of the simulation.
 * @param {number} config.gravity.angle - The angle of gravity, in degrees.
 * @param {number} config.gravity.strength - The strength of gravity.
 *
 * @param {Object} config.wind - Configure the wind.
 * @param {number} config.wind.angle - The angle of the wind, in degrees.
 * @param {number} config.wind.strength - The strength of the wind.
 */
function start(config = {}) {
  if (config.bg !== undefined) {
    bg = config.bg
  }

  if (config.primary !== undefined) {
    primary = config.primary
  }

  if (config.secondary !== undefined) {
    secondary = config.secondary
  }

  if (config.density !== undefined) {
    density = config.density
  }

  if (config.wave !== undefined) {
    if (config.wave.amplitude !== undefined) {
      amplitude = config.wave.amplitude
    }

    if (config.wave.frequency !== undefined) {
      frequency = config.wave.frequency
    }
  }

  if (config.gravity !== undefined) {
    if (
      config.gravity.angle !== undefined &&
      config.gravity.strength !== undefined
    ) {
      setGravity(config.gravity.angle, config.gravity.strength)
    }

    if (
      config.gravity.angle !== undefined &&
      config.gravity.strength === undefined
    ) {
      setGravity(config.gravity.angle, 0.6)
    }

    if (
      config.gravity.angle === undefined &&
      config.gravity.strength !== undefined
    ) {
      setGravity(90, config.gravity.strength)
    }
  }

  if (config.wind !== undefined) {
    if (config.wind.angle !== undefined && config.wind.strength !== undefined) {
      setWind(config.wind.angle, config.wind.strength)
    }

    if (config.wind.angle !== undefined && config.wind.strength === undefined) {
      setWind(config.wind.angle, 0.0)
    }

    if (config.wind.angle === undefined && config.wind.strength !== undefined) {
      setWind(0.0, config.wind.strength)
    }
  }

  canvas.width = appContainer.offsetWidth
  canvas.height = appContainer.offsetHeight
  appContainer.appendChild(canvas)

  snowflakes = makeSnowflakes(requiredSnowflakes())

  window.onresize = onResize
  window.requestAnimationFrame(onEnterFrame)
}

/**
 * Set the background colour
 *
 * @param {string} colour - The background colour of the Canvas
 */
function setBackground(col) {
  bg = col
}

/**
 * Sets the colour of the Snowflakes in the foreground
 *
 * @param {string} colour - A Hex string representing the colour of the
 *                          foreground snow.
 */
function setPrimary(col) {
  primary = col
}

/**
 * Sets the colour of the Snowflakes in the background
 *
 * @param {string} colour - A Hex string representing the colour of the
 *                          background snow.
 */
function setSecondary(col) {
  secondary = col
}

/**
 * Set the density of the Snowflakes. This is the number of snowflakes on screen
 * at a resolution of 1280 x 1080, but this number is scaled up and down at
 * higher and lower resolutions respectively to give a consistent look when
 * resizing.
 *
 * @param {number} density - A number representing the density of snowflakes.
 */
function setDensity(den) {
  density = den
  restart()
}

/**
 * Set the Amplitude of the Wave motion of the Snowflakes
 *
 * @param {number} amplitude - The Amplitude to set
 */
function setAmplitude(num) {
  amplitude = num
}

/**
 * Set the Frequency of the Wave motion of the Snowflakes.
 *
 * @param {number} frequency - The frequency to set
 */
function setFrequency(freq) {
  frequency = freq
}

/**
 * Set the angle and strength of gravity in the simulation.
 *
 * @param {number} angle - The angle of gravity, in degrees
 * @param {number} strength - The strength of the gravity
 */
function setGravity(degrees, strength) {
  gravity = vec2.fromDegrees(degrees)
  gravity.multiplyScalar(strength)
}

/**
 * Set the angle and strength of the wind in the simulation.
 *
 * @param {number} angle - The angle of the wind, in degrees
 * @param {number} strength - The strength of the wind
 */
function setWind(degrees, strength) {
  wind = vec2.fromDegrees(degrees)
  wind.multiplyScalar(strength)
}

function onResize() {
  canvas.width = appContainer.offsetWidth
  canvas.height = appContainer.offsetHeight

  snowflakes = makeSnowflakes(requiredSnowflakes())
}

function onEnterFrame() {
  update()
  render()

  window.requestAnimationFrame(onEnterFrame)
}

let t = 0

const w = vec2.create(0, 0)
const g = vec2.create(0, 0)

let sine = null

function update() {
  snowflakes.forEach(snowflake => {
    w.x = wind.x
    w.y = wind.y

    w.multiplyScalar(snowflake.size + snowflake.random)

    snowflake.pos.add(w)

    g.x = gravity.x
    g.y = gravity.y

    g.multiplyScalar(snowflake.size + snowflake.random)

    snowflake.pos.add(g)

    const phase = snowflake.noise

    sine = vec2.create(amplitude * Math.sin(frequency * t + phase), 0)

    snowflake.pos.add(sine)

    if (snowflake.pos.x > canvas.width) {
      snowflake.pos.x = 0
    }

    if (snowflake.pos.x < 0) {
      snowflake.pos.x = canvas.width
    }

    if (snowflake.pos.y > canvas.height) {
      snowflake.pos.y = 0
      snowflake.pos.x = Math.random() * canvas.width
    }

    if (snowflake.pos.y < 0) {
      snowflake.pos.y = canvas.height
      snowflake.pos.x = Math.random() * canvas.width
    }
  })

  t += 1
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (bg) {
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const bgSize = 7

  const foreground = snowflakes.filter(x => x.size >= bgSize)
  const background = snowflakes.filter(x => x.size < bgSize)

  ctx.fillStyle = primary
  background.forEach(snowflake => {
    ctx.beginPath()
    drawCircle(snowflake.pos, snowflake.size)
    ctx.fill()
  })

  ctx.fillStyle = secondary
  foreground.forEach(snowflake => {
    ctx.beginPath()
    drawCircle(snowflake.pos, snowflake.size)
    ctx.fill()
  })
}

function makeSnowflakes(num) {
  let result = []

  while (num--) {
    result.push({
      pos: vec2.create(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ),
      size: 3 + Math.random() * 5,
      // Random value, just to add some uncertainty
      noise: Math.random() * 10,
      amplitude: Math.random() * 2,
      frequency: Math.random() * 0.01,
      random: Math.random()
    })
  }

  return result
}

// This function figures out how many snowflakes we should use for our given canvas size
// Just setting a fixed number of snowflakes would give an uneven distribution of
// snowflakes across different screen sizes, for example.
function requiredSnowflakes() {
  const tenEightyPee = 1920 * 1080
  const thisScreen = canvas.width * canvas.height
  const snowflakeCount = Math.round(density * (thisScreen / tenEightyPee))

  return snowflakeCount
}

function drawCircle(position, radius) {
  ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI, false)
}

function restart() {
  snowflakes = makeSnowflakes(requiredSnowflakes())
}

module.exports = {
  setAmplitude,
  setBackground,
  setDensity,
  setFrequency,
  setGravity,
  setPrimary,
  setSecondary,
  setWind,
  start
}
