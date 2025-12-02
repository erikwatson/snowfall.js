import { Graphics, Vec2, vec2, Sprite, sprite } from '@erikwatson/bramble'
import { BaseLayerConfig, IBaseLayer, Snowflake } from '../types'
import {
  addWind,
  addGravity,
  addSwayMotion,
  screenWrap,
  addRotation,
  fadeIn
} from '../snowflake'
import { getDegreesFromVec2 } from '../math'
import { clone, makeSnowflakes, requiredSnowflakes } from '../utils'
import * as TWEEN from '@tweenjs/tween.js'

export class BaseLayer<T extends BaseLayerConfig> implements IBaseLayer {
  originalConfig: T
  config: T
  snowflakes: Snowflake[] = []
  width: number
  height: number
  paused: boolean = false
  windVector: Vec2
  gravityVector: Vec2
  fadeWindIn?: TWEEN.Tween<T>
  fadeWindOut?: TWEEN.Tween<T>

  constructor(
    config: T,
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

    const originalWindStrength = this.config.wind.strength

    if (this.config.wind.gusts.active) {
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
          if (changeChance < this.config.wind.gusts.changeChance) {
            const angle = getDegreesFromVec2(
              this.windVector.getOpposite(this.windVector)
            )

            this.setWindAngle(angle)
          }
        })
    }
  }

  setAmplitude(num: number): void {
    this.config.sway.amplitude = num
  }

  setFrequency(freq: number): void {
    this.config.sway.frequency = freq
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
    this.config.wind.gusts.active = gusts
    this.originalConfig = clone(this.config)
    this.restart()
  }

  togglePaused(): void {
    this.paused = !this.paused
  }

  setWindInAdditionalStrengthMin(min: number): void {
    this.config.wind.gusts.in.additionalStrength.min = min
    this.originalConfig = clone(this.config)
  }

  setWindInAdditionalStrengthMax(max: number): void {
    this.config.wind.gusts.in.additionalStrength.max = max
    this.originalConfig = clone(this.config)
  }

  setWindInDurationMin(min: number): void {
    this.config.wind.gusts.in.duration.min = min
    this.originalConfig = clone(this.config)
  }

  setWindInDurationMax(max: number): void {
    this.config.wind.gusts.in.duration.max = max
    this.originalConfig = clone(this.config)
  }

  setWindInDelayMin(min: number): void {
    this.config.wind.gusts.in.delay.min = min
    this.originalConfig = clone(this.config)
  }

  setWindInDelayMax(max: number): void {
    this.config.wind.gusts.in.delay.max = max
    this.originalConfig = clone(this.config)
  }

  setWindOutDurationMin(min: number): void {
    this.config.wind.gusts.out.duration.min = min
    this.originalConfig = clone(this.config)
  }

  setWindOutDurationMax(max: number): void {
    this.config.wind.gusts.out.duration.max = max
    this.originalConfig = clone(this.config)
  }

  setWindOutDelayMin(min: number): void {
    this.config.wind.gusts.out.delay.min = min
    this.originalConfig = clone(this.config)
  }

  setWindOutDelayMax(max: number): void {
    this.config.wind.gusts.out.delay.max = max
    this.originalConfig = clone(this.config)
  }

  setWindOutChangeChance(chance: number): void {
    this.config.wind.gusts.changeChance = chance
    this.originalConfig = clone(this.config)
  }

  update(dt: number): void {
    if (this.paused) {
      return
    }

    const { sway, gravity, wind } = this.config

    this.snowflakes.forEach(snowflake => {
      snowflake.time += dt

      addWind(snowflake, wind.angle, wind.strength)
      addRotation(snowflake)
      addGravity(snowflake, gravity.angle, gravity.strength)
      addSwayMotion(snowflake, gravity, sway)
      screenWrap(snowflake, this.width, this.height, gravity)
    })
  }

  render(gfx: Graphics): void {
    // Nothing to render
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
    if (this.config.wind.gusts.active) {
      if (this.fadeWindIn && this.fadeWindOut) {
        this.fadeWindIn.chain(this.fadeWindOut)
        this.fadeWindOut.chain(this.fadeWindIn)
        this.fadeWindIn.start()
      }
    }
  }

  pause(): void {
    this.paused = true
  }

  resume(): void {
    this.paused = false
  }

  restart(): void {
    this.fadeWindIn?.stopChainedTweens()
    this.fadeWindOut?.stopChainedTweens()

    this.setWind(
      this.originalConfig.wind.angle,
      this.originalConfig.wind.strength
    )

    if (this.config.wind.gusts.active) {
      this.fadeWindIn?.start()
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

  setMassMin(min: number): void {
    this.config.mass.min = min
    this.restart()
  }

  setMassMax(max: number): void {
    this.config.mass.max = max
    this.restart()
  }

  setSizeMin(min: number): void {
    this.config.size.min = min
    this.restart()
  }

  setSizeMax(max: number): void {
    this.config.size.max = max
    this.restart()
  }
}
