import * as TWEEN from '@tweenjs/tween.js'
import { vec2, Graphics } from '@erikwatson/bramble'
import { BaseLayer } from '../../layers/base-layer'
import { BaseLayerConfig, Snowflake } from '../../types'
import {
  addWind,
  addGravity,
  addSwayMotion,
  screenWrap,
  addRotation
} from '../../snowflake'
import { clone, makeSnowflakes, requiredSnowflakes } from '../../utils'

jest.mock('@tweenjs/tween.js')
jest.mock('../../snowflake')
jest.mock('../../math')
jest.mock('../../utils')

// Perfect mock — works everywhere
jest.mock('@erikwatson/bramble', () => ({
  vec2: {
    create: jest.fn(() => ({
      x: 0,
      y: 0,
      multiplyScalar: jest.fn(function (this: any, s: number) {
        this.x *= s
        this.y *= s
        return this
      })
    })),
    fromDegrees: jest.fn((deg: number) => ({
      x: Math.cos((deg * Math.PI) / 180),
      y: Math.sin((deg * Math.PI) / 180),
      multiplyScalar: jest.fn(function (this: any, s: number) {
        this.x *= s
        this.y *= s
        return this
      })
    }))
  },
  Graphics: jest.fn(),
  Sprite: jest.fn(),
  sprite: jest.fn()
}))

describe('BaseLayer', () => {
  let config: BaseLayerConfig
  let layer: BaseLayer<BaseLayerConfig>
  let mockTween: jest.MockedObject<TWEEN.Tween<any>>

  beforeEach(() => {
    jest.clearAllMocks()
    config = {
      density: 100,
      sway: { amplitude: 1, frequency: 0.5 },
      wind: {
        angle: 0,
        strength: 1,
        gusts: {
          active: false,
          changeChance: 0.5,
          in: {
            additionalStrength: { min: 0.5, max: 1.5 },
            duration: { min: 1000, max: 2000 },
            delay: { min: 500, max: 1000 }
          },
          out: {
            duration: { min: 1500, max: 2500 },
            delay: { min: 600, max: 1200 }
          }
        }
      },
      gravity: { angle: 90, strength: 9.8 },
      mass: { min: 1, max: 5 },
      size: { min: 2, max: 4 },
      opacity: { min: 0.5, max: 1 }
    }

    mockTween = {
      to: jest.fn().mockReturnThis(),
      easing: jest.fn().mockReturnThis(),
      delay: jest.fn().mockReturnThis(),
      onUpdate: jest.fn().mockReturnThis(),
      chain: jest.fn().mockReturnThis(),
      start: jest.fn().mockReturnThis(),
      onComplete: jest.fn().mockReturnThis(),
      stopChainedTweens: jest.fn()
    } as unknown as jest.MockedObject<TWEEN.Tween<any>>
    ;(TWEEN.Tween as jest.Mock).mockImplementation(() => mockTween)

    layer = new BaseLayer(config, 1920, 1080, 1.5, 1000, 500, 1500, 600, 0.3)
  })

  test('constructor initializes properties correctly without gusts', () => {
    expect(layer.originalConfig).toEqual(config)
    expect(layer.config).toEqual(config)
    expect(layer.width).toBe(1920)
    expect(layer.height).toBe(1080)
    expect(layer.paused).toBe(false)

    // Safe checks — never compare Vec2 instances directly
    expect(layer.windVector.x).toBe(0)
    expect(layer.windVector.y).toBe(0)
    expect(layer.gravityVector.x).toBe(0)
    expect(layer.gravityVector.y).toBe(0)

    expect(layer.fadeWindIn).toBeUndefined()
    expect(layer.fadeWindOut).toBeUndefined()
  })

  test('constructor sets up tweens when gusts are active', () => {
    config.wind.gusts.active = true
    layer = new BaseLayer(config, 1920, 1080, 1.5, 1000, 500, 1500, 600, 0.3)

    expect(TWEEN.Tween).toHaveBeenCalledTimes(2)
    expect(mockTween.to).toHaveBeenCalledWith({ wind: { strength: 1.5 } }, 1000)
    expect(mockTween.to).toHaveBeenCalledWith({ wind: { strength: 1 } }, 1500)
    expect(mockTween.easing).toHaveBeenCalledWith(TWEEN.Easing.Quadratic.InOut)
    expect(mockTween.easing).toHaveBeenCalledWith(TWEEN.Easing.Quadratic.Out)
    expect(mockTween.delay).toHaveBeenCalledWith(500)
    expect(mockTween.delay).toHaveBeenCalledWith(600)
    expect(mockTween.onUpdate).toHaveBeenCalled()
    expect(mockTween.onComplete).toHaveBeenCalled()
  })

  test('setWind updates config and windVector', () => {
    layer.setWind(0, 2)

    expect(layer.config.wind.angle).toBe(0)
    expect(layer.config.wind.strength).toBe(2)
    expect(vec2.fromDegrees).toHaveBeenCalledWith(0)
    expect(layer.windVector.x).toBeCloseTo(2)
    expect(layer.windVector.y).toBeCloseTo(0)
  })

  test('setGravity updates config, originalConfig, and gravityVector', () => {
    ;(clone as jest.Mock).mockReturnValueOnce({ ...config })

    layer.setGravity(90, 10)

    expect(layer.config.gravity.angle).toBe(90)
    expect(layer.config.gravity.strength).toBe(10)
    expect(clone).toHaveBeenCalledWith(layer.config)
    expect(vec2.fromDegrees).toHaveBeenCalledWith(90)

    // 90° = (0, 1) → multiplied by 10 = (0, 10)
    expect(layer.gravityVector.x).toBeCloseTo(0)
    expect(layer.gravityVector.y).toBeCloseTo(10)
  })

  test('update applies physics to snowflakes when not paused', () => {
    layer.paused = false
    layer.snowflakes = [{ time: 0 } as Snowflake, { time: 0 } as Snowflake]
    layer.update(0.016)

    expect(layer.snowflakes[0].time).toBe(0.016)
    expect(addWind).toHaveBeenCalledTimes(2)
    expect(addRotation).toHaveBeenCalledTimes(2)
    expect(addGravity).toHaveBeenCalledTimes(2)
    expect(addSwayMotion).toHaveBeenCalledTimes(2)
    expect(screenWrap).toHaveBeenCalledTimes(2)
  })

  test('update does nothing when paused', () => {
    layer.paused = true
    layer.snowflakes = [{ time: 0 } as Snowflake]
    layer.update(0.016)

    expect(layer.snowflakes[0].time).toBe(0)
    expect(addWind).not.toHaveBeenCalled()
  })

  test('start creates snowflakes and sets vectors', () => {
    ;(requiredSnowflakes as jest.Mock).mockReturnValue(200)
    ;(makeSnowflakes as jest.Mock).mockReturnValue([{} as Snowflake])

    layer.start()

    expect(layer.snowflakes).toHaveLength(1)
    expect(layer.windVector.x).toBeCloseTo(1) // angle 0, strength 1
    expect(layer.windVector.y).toBeCloseTo(0)
    expect(layer.gravityVector.x).toBeCloseTo(0)
    expect(layer.gravityVector.y).toBeCloseTo(9.8)
  })

  test('restart stops tweens, resets wind, restarts tweens if active, and recreates snowflakes', () => {
    config.wind.gusts.active = true
    layer = new BaseLayer(config, 1920, 1080, 1.5, 1000, 500, 1500, 600, 0.3)
    ;(requiredSnowflakes as jest.Mock).mockReturnValue(200)
    ;(makeSnowflakes as jest.Mock).mockReturnValue([{} as Snowflake])

    layer.restart()

    expect(mockTween.stopChainedTweens).toHaveBeenCalledTimes(2)
    expect(layer.windVector.x).toBeCloseTo(1)
    expect(layer.windVector.y).toBeCloseTo(0)
    expect(mockTween.start).toHaveBeenCalled()
    expect(layer.snowflakes).toHaveLength(1)
  })

  test('setDensity updates config and calls restart', () => {
    jest.spyOn(layer, 'restart')

    layer.setDensity(200)

    expect(layer.config.density).toBe(200)
    expect(layer.restart).toHaveBeenCalled()
  })

  test('render does nothing (empty implementation)', () => {
    const mockGfx = { clear: jest.fn() } as unknown as Graphics
    layer.render(mockGfx)
    expect(mockGfx.clear).not.toHaveBeenCalled()
  })
})
