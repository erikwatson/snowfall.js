import vec2 from './vec2'

const appContainer = document.querySelector('#snow-container')

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

let gravity = vec2.create(0, 0)
let wind = vec2.create(0, 0)
let density = 250

let snowflakes = []

// const primary = '#8d90b7'
// const secondary = '#ffffff'

function start () {
  canvas.width = appContainer.offsetWidth
  canvas.height = appContainer.offsetHeight
  appContainer.appendChild(canvas)

  snowflakes = makeSnowflakes(requiredSnowflakes())

  window.onresize = onResize
  window.requestAnimationFrame(onEnterFrame)
}

function onResize () {
  canvas.width = appContainer.offsetWidth
  canvas.height = appContainer.offsetHeight

  snowflakes = makeSnowflakes(requiredSnowflakes())
}

function onEnterFrame () {
  update()
  render()

  window.requestAnimationFrame(onEnterFrame)
}

let t = 0

const w = null
const g = null

const sine = null

function update () {
  snowflakes.forEach(snowflake => {
    w = vec2.clone(wind)
    w.multiplyScalar(snowflake.size + snowflake.random)
    snowflake.pos.add(w)

    g = vec2.clone(gravity)
    g.multiplyScalar(snowflake.size + snowflake.random)
    snowflake.pos.add(g)

    // TODO: Make a nicer way to change these
    // const amplitude = 1
    // const frequency = 0.05
    const phase = snowflake.noise

    sine = vec2.create(
      amplitude * Math.sin((frequency * t) + phase),
      0
    )

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

function render () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

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

function makeSnowflakes (num) {
  let result = []

  while (num--) {
    result.push({
      pos: vec2.create(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ),
      size: 3 + (Math.random() * 5),
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
function requiredSnowflakes () {
  const tenEightyPee = 1920 * 1080
  const thisScreen = canvas.width * canvas.height
  const snowflakeCount = Math.round(density * (thisScreen / tenEightyPee))

  return snowflakeCount
}

function drawCircle (position, radius) {
  ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI, false)
}

function restart () {
  snowflakes = makeSnowflakes(requiredSnowflakes())
}

export default {
  start,
  setGravity: (degrees, strength) => {
    gravity = vec2.fromDegrees(degrees)
    gravity.multiplyScalar(strength)
  },
  setWind: (degrees, strength) => {
    wind = vec2.fromDegrees(degrees)
    wind.multiplyScalar(strength)
  },
  setDensity: d => {
    density = d
    restart()
  }
}
