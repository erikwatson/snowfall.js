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
import { clone, requiredSnowflakes } from './utils'
import * as TWEEN from '@tweenjs/tween.js'

export function create(): Simulation {
  const simulation = game.create()
  const bgSize = 7 // size threshold for background layer snowflakes
  let snowflakes: Snowflake[] = []
  let foregroundLayer: Snowflake[]
  let backgroundLayer: Snowflake[]
  let paused = false
  let gravityVector: Vec2
  let windVector: Vec2
  let config: Config
  let originalConfig: Config
  let fadeWindIn: TWEEN.Tween<Config>
  let fadeWindOut: TWEEN.Tween<Config>

  function start(userConfig: UserConfig = {}) {
    config = merge(userConfig)
    originalConfig = clone(config)
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
        // setWind(config.wind.angle, config.wind.strength)
      })
      .onComplete(() => {
        if (random() < config.wind.out.changeChance) {
          const angle = getDegreesFromVec2(windVector.getOpposite(windVector)) // TODO: this needs fixing in Bramble
          // setWindAngle(angle)
        }
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
    fadeWindIn.stopChainedTweens()
    fadeWindOut.stopChainedTweens()

    console.log('???', originalConfig.wind.angle, originalConfig.wind.strength)
    setWind(originalConfig.wind.angle, originalConfig.wind.strength)

    if (config.wind.gusts) {
      fadeWindIn.start()
    }

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
    originalConfig = clone(config)
  }

  function setPrimary(col: string) {
    config.primary = col
    originalConfig = clone(config)
  }

  function setSecondary(col: string) {
    config.secondary = col
    originalConfig = clone(config)
  }

  function setDensity(den: number) {
    config.density = den
    originalConfig = clone(config)
    restart()
  }

  function setRespectOrientation(val: boolean) {
    config.fadeIn = val
    originalConfig = clone(config)
  }

  function setFade(val: boolean) {
    config.fadeIn = val
    originalConfig = clone(config)
    restart()
  }

  function setAmplitude(num: number) {
    config.wave.amplitude = num
    originalConfig = clone(config)
  }

  function setFrequency(freq: number) {
    config.wave.frequency = freq
    originalConfig = clone(config)
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

    originalConfig = clone(config)

    windVector = vec2.fromDegrees(degrees)
    windVector.multiplyScalar(strength)
  }

  function setWindAngle(degrees: number) {
    config.wind.angle = degrees
    originalConfig = clone(config)

    const strength = windVector.getLength()
    windVector = vec2.fromDegrees(degrees)
    windVector.multiplyScalar(strength)
  }

  function setWindStrength(strength: number) {
    config.wind.strength = strength
    originalConfig = clone(config)

    const degrees = getDegreesFromVec2(windVector)
    windVector = vec2.fromDegrees(degrees)
    windVector.multiplyScalar(strength)
  }

  function setGusts(shouldGust: boolean) {
    config.wind.gusts = shouldGust
    originalConfig = clone(config)
    restart()
  }

  function setGravity(degrees: number, strength: number) {
    config.gravity.angle = degrees
    config.gravity.strength = strength
    originalConfig = clone(config)

    gravityVector = vec2.fromDegrees(degrees)
    gravityVector.multiplyScalar(strength)
  }

  function setGravityAngle(degrees: number) {
    config.gravity.angle = degrees
    originalConfig = clone(config)

    const strength = gravityVector.getLength()
    gravityVector = vec2.fromDegrees(degrees)
    gravityVector.multiplyScalar(strength)
  }

  function setGravityStrength(strength: number) {
    config.gravity.strength = strength
    originalConfig = clone(config)

    const degrees = getDegreesFromVec2(gravityVector)
    gravityVector = vec2.fromDegrees(degrees)
    gravityVector.multiplyScalar(strength)
  }

  function setWindInAdditionalStrengthMin(min: number) {
    config.wind.in.additionalStrength.min = min
    originalConfig = clone(config)
  }

  function setWindInAdditionalStrengthMax(max: number) {
    config.wind.in.additionalStrength.max = max
    originalConfig = clone(config)
  }

  function setWindInDurationMin(min: number) {
    config.wind.in.duration.min = min
    originalConfig = clone(config)
  }

  function setWindInDurationMax(max: number) {
    config.wind.in.duration.max = max
    originalConfig = clone(config)
  }

  function setWindInDelayMin(min: number) {
    config.wind.in.delay.min = min
    originalConfig = clone(config)
  }

  function setWindInDelayMax(max: number) {
    config.wind.in.delay.max = max
    originalConfig = clone(config)
  }

  function setWindOutDurationMin(min: number) {
    config.wind.out.duration.min = min
    originalConfig = clone(config)
  }

  function setWindOutDurationMax(max: number) {
    config.wind.out.duration.max = max
    originalConfig = clone(config)
  }

  function setWindOutDelayMin(min: number) {
    config.wind.out.delay.min = min
    originalConfig = clone(config)
  }

  function setWindOutDelayMax(max: number) {
    config.wind.out.delay.max = max
    originalConfig = clone(config)
  }

  function setWindOutChangeChance(chance: number) {
    config.wind.out.changeChance = chance
    originalConfig = clone(config)

    console.log(config)
  }

  return {
    start,
    setAmplitude,
    setBackground,
    setDensity,
    setRespectOrientation,
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
    setGusts,
    togglePaused,
    setWindInAdditionalStrengthMin,
    setWindInAdditionalStrengthMax,
    setWindInDurationMin,
    setWindInDurationMax,
    setWindInDelayMin,
    setWindInDelayMax,
    setWindOutDurationMin,
    setWindOutDurationMax,
    setWindOutDelayMin,
    setWindOutDelayMax,
    setWindOutChangeChance
  }
}
