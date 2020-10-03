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

function setGravity(degrees, strength) {
  gravity = vec2.fromDegrees(degrees)
  gravity.multiplyScalar(strength)
}

function setWind(degrees, strength) {
  wind = vec2.fromDegrees(degrees)
  wind.multiplyScalar(strength)
}

function setAmplitude(num) {
  amplitude = num
}

function setAngle(deg) {
  degrees = deg
}

function setBackground(col) {
  bg = col
}

function setDensity(den) {
  density = den
  restart()
}

function setFrequency(freq) {
  frequency = freq
}

function setPrimary(col) {
  primary = col
}

function setSecondary(col) {
  secondary = col
}

function setStrength(str) {
  strength = str
}

module.exports = {
  setAmplitude,
  setAngle,
  setBackground,
  setDensity,
  setFrequency,
  setGravity,
  setPrimary,
  setSecondary,
  setStrength,
  setWind,
  start
}
