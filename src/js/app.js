import { onPageLoaded } from './events'

const appContainer = document.querySelector('#snow-container')

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

const snowflakes = makeSnowflakes(250)
// const wind = -1 // Should be a Vector really

function start () {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  appContainer.appendChild(canvas)

  window.requestAnimationFrame(onEnterFrame)
}

function onEnterFrame () {
  update()
  render()

  window.requestAnimationFrame(onEnterFrame)
}

function update () {
  snowflakes.forEach(snowflake => {
    // snowflake.y += (snowflake.size / 10)
    // snowflake.x += (snowflake.size / 10) * wind

    snowflake.x = sineWave({ x: snowflake.x, y: snowflake.y }, -1, 25, 50).x
    snowflake.y = (window.innerHeight / 2) + sineWave({ x: snowflake.x, y: snowflake.y }, 1, 25, 50).y

    if (snowflake.y > window.innerHeight) {
      snowflake.y = -snowflake.size
    }

    if (snowflake.x < -snowflake.size) {
      snowflake.x = window.innerWidth + snowflake.size
    }
  })
}

function render () {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  ctx.fillStyle = 'rgb(255, 255, 255)'

  snowflakes.forEach(snowflake => {
    ctx.fillRect(snowflake.x, snowflake.y, snowflake.size, snowflake.size)
  })
}

function makeSnowflakes (num) {
  let result = []

  while (num--) {
    result.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 5 + (Math.random() * 10)
    })
  }

  return result
}

function sineWave (startPos, speed, waveHeight, waveLength) {
  let p = startPos

  p.x += speed
  p.y = (Math.sin(p.x / waveLength) * waveHeight)

  return p
}

// Start the app
onPageLoaded(() => {
  start()
})
