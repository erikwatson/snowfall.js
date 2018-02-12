import { onPageLoaded } from './events'

const appContainer = document.querySelector('#snow-container')

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

const gravity = 0.2
const wind = 0

let snowflakes = []

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

function update () {
  snowflakes.forEach(snowflake => {
    const frequency = snowflake.size / 5000

    const waveLength = snowflake.size / 10
    const waveHeight = snowflake.size / 8

    const sineWaveOffset = sineWave(
      snowflake.pos.y,
      waveLength,
      waveHeight,
      frequency
    )

    snowflake.pos.x += sineWaveOffset
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

function requiredSnowflakes () {
  const tenEightyPee = 1920 * 1080
  const thisScreen = canvas.width * canvas.height
  const snowflakeCount = Math.round(250 * (thisScreen / tenEightyPee))

  return snowflakeCount
}

function sineWave (yPos, waveLength, waveHeight, frequency) {
  return waveLength * Math.sin(frequency * (yPos / waveHeight) * 2 * Math.PI)
}

function drawCircle (position, radius) {
  ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI, false)
}

onPageLoaded(() => {
  start()
})
