import { onPageLoaded } from './events'

const appContainer = document.querySelector('#snow-container')

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

const gravity = 0.2
let snowflakes = makeSnowflakes(250)
const wind = 0

function start () {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  appContainer.appendChild(canvas)

  window.onresize = onResize
  window.requestAnimationFrame(onEnterFrame)
}

function onResize () {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const tenEightyPee = 1920 * 1080
  const thisScreen = window.innerWidth * window.innerHeight
  const snowflakeCount = Math.round(250 * (thisScreen / tenEightyPee))

  snowflakes = makeSnowflakes(snowflakeCount)
}

function onEnterFrame () {
  update()
  render()

  window.requestAnimationFrame(onEnterFrame)
}

function update () {
  sineWave({x: 0, y: 0}, 1, 1, 1)

  snowflakes.forEach(snowflake => {
    const frequency = snowflake.size / 5000

    const waveLength = snowflake.size / 10
    const waveHeight = snowflake.size / 8

    snowflake.pos.x += waveLength * Math.sin(frequency * (snowflake.pos.y / waveHeight) * 2 * Math.PI)
    snowflake.pos.y += gravity * (snowflake.size + snowflake.random)

    snowflake.pos.x += wind

    if (snowflake.pos.y > window.innerHeight + snowflake.size) {
      snowflake.pos.y = -snowflake.size
    }

    if (snowflake.pos.x < -snowflake.size) {
      snowflake.pos.x = window.innerWidth + snowflake.size
      snowflake.pos.y = Math.random() * window.innerHeight
    }

    if (snowflake.pos.x > window.innerWidth + snowflake.size) {
      snowflake.pos.x = -snowflake.size
      snowflake.pos.y = Math.random() * window.innerHeight
    }
  })
}

function render () {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

  const bgSize = 7

  const foreground = snowflakes.filter(x => x.size >= bgSize)
  const background = snowflakes.filter(x => x.size < bgSize)

  ctx.fillStyle = '#8d90b7'
  background.forEach(snowflake => {
    ctx.beginPath()
    drawCircle(snowflake.pos, snowflake.size)
    ctx.fill()
  })

  ctx.fillStyle = 'white'
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
      pos: {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
      },
      size: 3 + (Math.random() * 5),
      random: Math.random() * 10
    })
  }

  return result
}

function sineWave (startPos, speed, waveHeight, waveLength) {
  let position = { x: 0, y: 0 }

  position.x = speed + startPos.x
  position.y = Math.sin(startPos.x / waveLength) * waveHeight

  return position
}

function drawCircle (position, radius) {
  ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI, false)
}

// Start the app
onPageLoaded(() => {
  start()
})
