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
import { Config, Simulation, Snowflake, UserConfig } from './types'
import { merge } from './config'
import { requiredSnowflakes } from './utils'
import * as TWEEN from '@tweenjs/tween.js'

export function create(): Simulation {
  const simulation = game.create()
  const bgSize = 7 // size threshold for background layer snowflakes
  let snowflakes: Snowflake[] = []
  let foregroundLayer: Snowflake[]
  let backgroundLayer: Snowflake[]
  let paused = false
  let gravity: Vec2
  let wind: Vec2
  let config: Config
  let fadeWindIn: TWEEN.Tween<Config>
  let fadeWindOut: TWEEN.Tween<Config>

  function start(userConfig: UserConfig = {}) {
    config = merge(userConfig)
    const { wind, gravity, attachTo } = config

    const originalWindStrength = wind.strength

    if (!attachTo) {
      console.error(
        'Unable to start the application, the specified container could not be found.'
      )
      return
    }

    setWind(wind.angle, wind.strength)
    setGravity(gravity.angle, gravity.strength)
    makeSnowflakes(
      requiredSnowflakes(
        config.attachTo.offsetWidth,
        config.attachTo.offsetHeight,
        config.density
      )
    )

    window.onresize = onResize

    // set up wind gusts
    fadeWindIn = new TWEEN.Tween(config)
      .to(
        {
          wind: {
            strength: random(
              originalWindStrength + config.wind.in.additionalStrength.min,
              originalWindStrength + config.wind.in.additionalStrength.max
            )
          }
        },
        random(config.wind.in.delay.min, config.wind.in.delay.max)
      )
      .easing(TWEEN.Easing.Quadratic.InOut)
      .delay(random(config.wind.in.delay.min, config.wind.in.delay.max))
      .onUpdate(() => {
        setWind(config.wind.angle, config.wind.strength)
      })

    fadeWindOut = new TWEEN.Tween(config)
      .to(
        { wind: { strength: originalWindStrength } },
        random(config.wind.out.duration.min, config.wind.out.duration.max)
      )
      .easing(TWEEN.Easing.Quadratic.Out)
      .delay(random(config.wind.out.delay.min, config.wind.out.delay.max))
      .onUpdate(() => {
        setWind(config.wind.angle, config.wind.strength)
      })

    if (config.wind.gusts) {
      fadeWindIn.chain(fadeWindOut)
      fadeWindOut.chain(fadeWindIn)

      fadeWindIn.start()
    }

    simulation.attachTo(attachTo)
    simulation.setSize(attachTo.offsetWidth, attachTo.offsetHeight)
    simulation.setUpdate(dt => update(dt))
    simulation.setRender(gfx => render(gfx))
    simulation.start()
  }

  function update(dt: number) {
    TWEEN.update()

    const { attachTo, wave, gravity, wind } = config

    snowflakes.forEach(snowflake => {
      addWind(snowflake, wind.angle, wind.strength)
      addGravity(snowflake, gravity.angle, gravity.strength)
      addWaveMotion(snowflake, gravity, wave, dt)
      screenWrap(snowflake, attachTo.offsetWidth, attachTo.offsetHeight)
      fadeIn(snowflake)
    })
  }

  function render(gfx: Graphics) {
    const { background, primary, secondary } = config

    gfx.clear(background)

    drawLayer(gfx, backgroundLayer, primary)
    drawLayer(gfx, foregroundLayer, secondary)
  }

  function onResize() {
    simulation.setSize(
      config.attachTo.offsetWidth,
      config.attachTo.offsetHeight
    )
    makeSnowflakes(
      requiredSnowflakes(
        config.attachTo.offsetWidth,
        config.attachTo.offsetHeight,
        config.density
      )
    )
  }

  function makeSnowflakes(num: number) {
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

  function restart() {
    makeSnowflakes(
      requiredSnowflakes(
        config.attachTo.offsetWidth,
        config.attachTo.offsetHeight,
        config.density
      )
    )
  }

  function setBackground(col: string) {
    config.background = col
  }

  function setPrimary(col: string) {
    config.primary = col
  }

  function setSecondary(col: string) {
    config.secondary = col
  }

  function setDensity(den: number) {
    config.density = den
    restart()
  }

  function setFade(val: boolean) {
    config.fadeIn = val
    restart()
  }

  function setAmplitude(num: number) {
    config.wave.amplitude = num
  }

  function setFrequency(freq: number) {
    config.wave.frequency = freq
  }

  function setPaused(pause: boolean) {
    paused = pause
  }

  function togglePaused() {
    paused = !paused
  }

  function setWind(degrees: number, strength: number) {
    config.wind.angle = degrees
    config.wind.strength = strength

    wind = vec2.fromDegrees(degrees)
    wind.multiplyScalar(strength)
  }

  function setWindAngle(degrees: number) {
    config.wind.angle = degrees

    const strength = wind.getLength()
    wind = vec2.fromDegrees(degrees)
    wind.multiplyScalar(strength)
  }

  function setWindStrength(strength: number) {
    config.wind.strength = strength

    const degrees = getDegreesFromVec2(wind)
    wind = vec2.fromDegrees(degrees)
    wind.multiplyScalar(strength)
  }

  function setGravity(degrees: number, strength: number) {
    config.gravity.angle = degrees
    config.gravity.strength = strength

    gravity = vec2.fromDegrees(degrees)
    gravity.multiplyScalar(strength)
  }

  function setGravityAngle(degrees: number) {
    config.gravity.angle = degrees

    const strength = gravity.getLength()
    gravity = vec2.fromDegrees(degrees)
    gravity.multiplyScalar(strength)
  }

  function setGravityStrength(strength: number) {
    config.gravity.strength = strength

    const degrees = getDegreesFromVec2(gravity)
    gravity = vec2.fromDegrees(degrees)
    gravity.multiplyScalar(strength)
  }

  return {
    start,
    setAmplitude,
    setBackground,
    setDensity,
    setFade,
    setFrequency,
    setGravity,
    setGravityAngle,
    setGravityStrength,
    setPaused,
    setPrimary,
    setSecondary,
    setWind,
    setWindAngle,
    setWindStrength,
    togglePaused
  }
}
