import { Graphics, Vec2, vec2 } from '@erikwatson/bramble'
import { ConfigLayer, SnowfallLayer, Snowflake } from './types'
import {
  addWind,
  addGravity,
  addWaveMotion,
  screenWrap,
  fadeIn
} from './snowflake'
import { getDegreesFromVec2, lerp } from './math'
import { clone, makeSnowflakes, requiredSnowflakes } from './utils'
import * as TWEEN from '@tweenjs/tween.js'

export class Layer implements SnowfallLayer {
  originalConfig: ConfigLayer
  config: ConfigLayer
  snowflakes: Snowflake[] = []
  width: number
  height: number
  paused: boolean = false
  windVector: Vec2
  gravityVector: Vec2
  fadeWindIn: TWEEN.Tween<ConfigLayer>
  fadeWindOut: TWEEN.Tween<ConfigLayer>

  constructor(
    config: ConfigLayer,
    width: number,
    height: number,
    strength: number,
    durationIn: number,
    windDelayIn: number,
    durationOut: number,
    windDelayOut: number,
    changeChance: number
  ) {
    this.originalConfig = config
    this.config = config
    this.width = width
    this.height = height
    this.windVector = vec2.create(0, 0)
    this.gravityVector = vec2.create(0, 0)

    // TODO: Get rid of this, it's just for testing
    this.config.wind.out.changeChance = 1

    const originalWindStrength = this.config.wind.strength

    this.fadeWindIn = new TWEEN.Tween(config)
      .to({ wind: { strength } }, durationIn)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .delay(windDelayIn)
      .onUpdate(() => {
        this.setWind(this.config.wind.angle, this.config.wind.strength)
      })

    this.fadeWindOut = new TWEEN.Tween(config)
      .to({ wind: { strength: originalWindStrength } }, durationOut)
      .easing(TWEEN.Easing.Quadratic.Out)
      .delay(windDelayOut)
      .onUpdate(() => {
        this.setWind(this.config.wind.angle, this.config.wind.strength)
      })
      .onComplete(() => {
        if (changeChance < this.config.wind.out.changeChance) {
          const angle = getDegreesFromVec2(
            this.windVector.getOpposite(this.windVector)
          )

          this.setWindAngle(angle)
        }
      })
  }

  setAmplitude(num: number): void {
    this.config.wave.amplitude = num
  }

  setFade(val: boolean): void {
    this.config.fadeIn = val
    this.restart()
  }

  setFrequency(freq: number): void {
    this.config.wave.frequency = freq
  }

  setGravity(degrees: number, strength: number): void {
    this.config.gravity.angle = degrees
    this.config.gravity.strength = strength
    this.originalConfig = clone(this.config)

    this.gravityVector = vec2.fromDegrees(degrees)
    this.gravityVector.multiplyScalar(strength)
  }

  setGravityAngle(degrees: number): void {
    this.config.gravity.angle = degrees
    this.originalConfig = clone(this.config)

    const strength = this.gravityVector.getLength()

    this.gravityVector = vec2.fromDegrees(degrees)
    this.gravityVector.multiplyScalar(strength)
  }

  setGravityStrength(strength: number): void {
    this.config.gravity.strength = strength
    this.originalConfig = clone(this.config)

    const degrees = getDegreesFromVec2(this.gravityVector)

    this.gravityVector = vec2.fromDegrees(degrees)
    this.gravityVector.multiplyScalar(strength)
  }

  setRespectOrientation(val: boolean): void {
    this.config.gravity.respectOrientation = val
  }

  setPaused(pause: boolean): void {
    this.paused = pause
  }

  setWind(degrees: number, strength: number): void {
    this.config.wind.angle = degrees
    this.config.wind.strength = strength

    this.windVector = vec2.fromDegrees(degrees)
    this.windVector.multiplyScalar(strength)
  }

  setWindAngle(degrees: number): void {
    this.config.wind.angle = degrees
    this.originalConfig = clone(this.config)

    const strength = this.windVector.getLength()

    this.windVector = vec2.fromDegrees(degrees)
    this.windVector.multiplyScalar(strength)
  }

  setWindStrength(strength: number): void {
    this.config.wind.strength = strength
    this.originalConfig = clone(this.config)

    const degrees = getDegreesFromVec2(this.windVector)

    this.windVector = vec2.fromDegrees(degrees)
    this.windVector.multiplyScalar(strength)
  }

  setGusts(gusts: boolean): void {
    this.config.wind.gusts = gusts
    this.originalConfig = clone(this.config)
    this.restart()
  }

  togglePaused(): void {
    this.paused = !this.paused
  }

  setWindInAdditionalStrengthMin(min: number): void {
    this.config.wind.in.additionalStrength.min = min
    this.originalConfig = clone(this.config)
  }

  setWindInAdditionalStrengthMax(max: number): void {
    this.config.wind.in.additionalStrength.max = max
    this.originalConfig = clone(this.config)
  }

  setWindInDurationMin(min: number): void {
    this.config.wind.in.duration.min = min
    this.originalConfig = clone(this.config)
  }

  setWindInDurationMax(max: number): void {
    this.config.wind.in.duration.max = max
    this.originalConfig = clone(this.config)
  }

  setWindInDelayMin(min: number): void {
    this.config.wind.in.delay.min = min
    this.originalConfig = clone(this.config)
  }

  setWindInDelayMax(max: number): void {
    this.config.wind.in.delay.max = max
    this.originalConfig = clone(this.config)
  }

  setWindOutDurationMin(min: number): void {
    this.config.wind.out.duration.min = min
    this.originalConfig = clone(this.config)
  }

  setWindOutDurationMax(max: number): void {
    this.config.wind.out.duration.max = max
    this.originalConfig = clone(this.config)
  }

  setWindOutDelayMin(min: number): void {
    this.config.wind.out.delay.min = min
    this.originalConfig = clone(this.config)
  }

  setWindOutDelayMax(max: number): void {
    this.config.wind.out.delay.max = max
    this.originalConfig = clone(this.config)
  }

  setWindOutChangeChance(chance: number): void {
    this.config.wind.out.changeChance = chance
    this.originalConfig = clone(this.config)
  }

  update(dt: number): void {
    const { wave, gravity, wind } = this.config

    this.snowflakes.forEach(snowflake => {
      snowflake.time += dt

      addWind(snowflake, wind.angle, wind.strength)
      addGravity(snowflake, gravity.angle, gravity.strength)
      addWaveMotion(snowflake, gravity, wave, dt)
      screenWrap(snowflake, this.width, this.height, gravity)
    })
  }

  render(gfx: Graphics): void {
    this.snowflakes.forEach(snowflake => {
      gfx.circle(snowflake.position, snowflake.renderedSize, {
        fill: { colour: snowflake.colour },
        line: { width: 0 }
      })
    })
  }

  start(): void {
    this.snowflakes = makeSnowflakes(
      requiredSnowflakes(this.width, this.height, this.config.density),
      this.config,
      this.width,
      this.height
    )

    this.setWind(this.config.wind.angle, this.config.wind.strength)
    this.setGravity(this.config.gravity.angle, this.config.gravity.strength)

    // set up wind gusts
    if (this.config.wind.gusts) {
      this.fadeWindIn.chain(this.fadeWindOut)
      this.fadeWindOut.chain(this.fadeWindIn)
      this.fadeWindIn.start()
    }
  }

  pause(): void {
    this.paused = true
  }

  resume(): void {
    this.paused = false
  }

  restart(): void {
    this.fadeWindIn.stopChainedTweens()
    this.fadeWindOut.stopChainedTweens()

    this.setWind(
      this.originalConfig.wind.angle,
      this.originalConfig.wind.strength
    )

    if (this.config.wind.gusts) {
      this.fadeWindIn.start()
    }

    this.snowflakes = makeSnowflakes(
      requiredSnowflakes(this.width, this.height, this.config.density),
      this.config,
      this.width,
      this.height
    )
  }

  setDensity(density: number): void {
    this.config.density = density
    this.restart()
  }

  setColour(colour: string): void {
    this.config.colour = colour
  }
}
