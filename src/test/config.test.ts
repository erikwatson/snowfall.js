import {
  DEFAULT_WIND_IN_ADDITIONAL_STRENGTH_MIN,
  DEFAULT_IMAGE,
  DEFAULT_DENSITY,
  DEFAULT_MASS_MAX,
  DEFAULT_SIZE_MIN,
  DEFAULT_SIZE_MAX,
  DEFAULT_FREQUENCY,
  DEFAULT_WIND_ANGLE,
  DEFAULT_WIND_IN_DURATION_MAX,
  DEFAULT_WIND_OUT_DELAY_MIN,
  DEFAULT_SIMPLE_LAYER,
  DEFAULT_IMAGE_LAYER
} from '../index'
import { merge2, diff } from '../config'
import type { DeepPartial, ImageLayerConfig, UserConfig } from '../types'

describe('Config diffing', () => {
  it('should diff density change', () => {
    const conf: UserConfig = { layers: [{ density: 300 }] }
    const result = diff(conf)
    expect(result).toEqual(conf)
  })

  it('should omit density if default', () => {
    const conf: UserConfig = { layers: [{ density: DEFAULT_DENSITY }] }
    const result = diff(conf)
    expect(result).toEqual({ layers: [{}] })
  })

  it('should diff mass bounds partial', () => {
    const conf: UserConfig = { layers: [{ mass: { max: 5 } }] }
    const result = diff(conf)
    expect(result).toEqual({ layers: [{ mass: { max: 5 } }] })
  })

  it('should diff image layer with nested base change', () => {
    const conf: UserConfig = {
      layers: [{ mode: 'image', image: 'custom.png', size: { min: 2 } }]
    }
    const result = diff(conf)
    expect(result).toEqual({
      layers: [{ mode: 'image', image: 'custom.png', size: { min: 2 } }]
    })
  })

  it('should infer image without mode if rotate provided', () => {
    const conf: UserConfig = { layers: [{ rotate: true }] }
    const result = diff(conf)
    expect(result).toEqual({ layers: [{ mode: 'image', rotate: true }] })
  })

  it('should diff full wind gusts in.delay', () => {
    const conf: UserConfig = {
      layers: [{ wind: { gusts: { in: { delay: { min: 500, max: 2000 } } } } }]
    }
    const result = diff(conf)
    expect(result).toEqual(conf)
  })

  it('should merge density with default fill', () => {
    const config: UserConfig = { layers: [{ density: 300 }] }
    const result = merge2(config)
    expect(result.layers[0].density).toBe(300)
  })

  it('should merge mass partials', () => {
    const config: UserConfig = { layers: [{ mass: { min: 2 } }] }
    const result = merge2(config)
    expect(result.layers[0].mass).toEqual({ min: 2, max: DEFAULT_MASS_MAX })
  })

  it('should merge image with mode added and set to image if image provided', () => {
    const config: UserConfig = {
      layers: [{ mode: 'image', image: 'flake.png' }]
    }
    const result = merge2(config)
    const layer = result.layers[0]
    if ('image' in layer) {
      expect(layer.mode).toBe('image')
      expect(layer.image).toBe('flake.png')
    } else {
      fail('Expected image layer')
    }
  })

  it('should merge deep gusts out.duration full', () => {
    const config: UserConfig = {
      layers: [
        { wind: { gusts: { out: { duration: { min: 2000, max: 12000 } } } } }
      ]
    }
    const result = merge2(config)
    expect(result.layers[0].wind.gusts.out.duration).toEqual({
      min: 2000,
      max: 12000
    })
  })

  it('should diff an image layer with custom image and rotate', () => {
    const imageLayer: DeepPartial<ImageLayerConfig> = {
      mode: 'image',
      image: 'snowflake.png',
      rotate: true
    }
    const conf: UserConfig = {
      layers: [imageLayer]
    }
    const result = diff(conf)
    expect(result).toEqual({ layers: [imageLayer] })
  })

  it('should diff an image layer with default rotate (false)', () => {
    const imageLayer: DeepPartial<ImageLayerConfig> = {
      mode: 'image',
      image: 'snowflake.png',
      rotate: false
    }
    const conf: UserConfig = {
      layers: [imageLayer]
    }
    const result = diff(conf)
    expect(result).toEqual({
      layers: [{ mode: 'image', image: 'snowflake.png' }]
    })
  })

  it('should omit image layer properties set to defaults', () => {
    const imageLayer: DeepPartial<ImageLayerConfig> = {
      mode: 'image',
      image: 'custom.png',
      rotate: false
    } // Non-default image
    const conf: UserConfig = {
      layers: [imageLayer]
    }
    const result = diff(conf)
    expect(result).toEqual({
      layers: [{ mode: 'image', image: 'custom.png' }]
    })
  })

  it('should omit image if set to default in image layer', () => {
    const imageLayer: DeepPartial<ImageLayerConfig> = {
      mode: 'image',
      image: DEFAULT_IMAGE
    }
    const conf: UserConfig = {
      layers: [imageLayer]
    }
    const result = diff(conf)
    expect(result).toEqual({
      layers: [{ mode: 'image' }]
    })
  })

  it('should diff nested size bounds changes', () => {
    const conf: UserConfig = {
      layers: [{ size: { min: 2, max: 4 } }]
    }
    const result = diff(conf)
    expect(result).toEqual(conf)
  })

  it('should diff partial size bounds (only min changed)', () => {
    const conf: UserConfig = {
      layers: [{ size: { min: 2 } }]
    }
    const result = diff(conf)
    expect(result).toEqual({
      layers: [{ size: { min: 2 } }]
    })
  })

  it('should omit size bounds if set to defaults', () => {
    const conf: UserConfig = {
      layers: [{ size: { min: DEFAULT_SIZE_MIN, max: DEFAULT_SIZE_MAX } }]
    }
    const result = diff(conf)
    expect(result).toEqual({ layers: [{}] })
  })

  it('should diff sway properties', () => {
    const conf: UserConfig = {
      layers: [{ sway: { frequency: 0.05, amplitude: 2.0 } }]
    }
    const result = diff(conf)
    expect(result).toEqual(conf)
  })

  it('should diff partial sway (only frequency changed)', () => {
    const conf: UserConfig = {
      layers: [{ sway: { frequency: 0.05 } }]
    }
    const result = diff(conf)
    expect(result).toEqual(conf)
  })

  it('should diff gravity changes', () => {
    const conf: UserConfig = {
      layers: [{ gravity: { angle: 45, strength: 1.0 } }]
    }
    const result = diff(conf)
    expect(result).toEqual(conf)
  })

  it('should diff wind angle without strength', () => {
    const conf: UserConfig = {
      layers: [{ wind: { angle: 45 } }]
    }
    const result = diff(conf)
    expect(result).toEqual(conf)
  })

  it('should diff deep nested gusts properties', () => {
    const conf: UserConfig = {
      layers: [
        {
          wind: {
            gusts: {
              in: {
                additionalStrength: { min: 10, max: 50 }
              }
            }
          }
        }
      ]
    }
    const result = diff(conf)
    expect(result).toEqual(conf)
  })

  it('should diff wind gusts active false', () => {
    const conf: UserConfig = {
      layers: [{ wind: { gusts: { active: false } } }]
    }
    const result = diff(conf)
    expect(result).toEqual(conf)
  })

  it('should diff wind gusts changeChance', () => {
    const conf: UserConfig = {
      layers: [{ wind: { gusts: { changeChance: 0.5 } } }]
    }
    const result = diff(conf)
    expect(result).toEqual(conf)
  })

  it('should diff wind gusts out duration partial', () => {
    const conf: UserConfig = {
      layers: [{ wind: { gusts: { out: { duration: { min: 2000 } } } } }]
    }
    const result = diff(conf)
    expect(result).toEqual(conf)
  })

  it('should handle mixed simple and image layers in diff', () => {
    const imageLayer: DeepPartial<ImageLayerConfig> = {
      mode: 'image',
      image: 'flake.png'
    }
    const conf: UserConfig = {
      layers: [
        { colour: '#ff0000' }, // Simple
        imageLayer // Image
      ]
    }
    const result = diff(conf)
    expect(result).toEqual({
      layers: [{ colour: '#ff0000' }, { mode: 'image', image: 'flake.png' }]
    })
  })

  it('should omit entire layer if all properties are defaults', () => {
    const conf: UserConfig = {
      layers: [{ ...DEFAULT_SIMPLE_LAYER }]
    }
    const result = diff(conf)
    expect(result).toEqual({ layers: [{}] })
  })
})

describe('config merging', () => {
  it('should merge a partial simple layer with defaults', () => {
    const config: UserConfig = {
      layers: [{ colour: '#ff0000' }]
    }
    const result = merge2(config)
    expect(result).toEqual({
      attachTo: 'snowfall',
      layers: [
        {
          ...DEFAULT_SIMPLE_LAYER,
          colour: '#ff0000'
        }
      ]
    })
  })

  it('should merge an image layer with defaults', () => {
    const imageLayer: DeepPartial<ImageLayerConfig> = {
      mode: 'image',
      image: 'snowflake.png',
      rotate: true
    }
    const config: UserConfig = {
      layers: [imageLayer]
    }
    const result = merge2(config)
    expect(result).toEqual({
      attachTo: 'snowfall',
      layers: [
        {
          ...DEFAULT_IMAGE_LAYER,
          image: 'snowflake.png',
          rotate: true
        }
      ]
    })
  })

  it('should assume simple mode if not specified and colour is provided', () => {
    const config: UserConfig = {
      layers: [{ colour: '#ff0000' }]
    }
    const result = merge2(config)
    expect(result.layers[0].mode).toBe('simple')
  })

  it('should merge nested properties with partials', () => {
    const config: UserConfig = {
      layers: [
        {
          size: { min: 2 },
          sway: { amplitude: 1.5 },
          wind: {
            strength: 5,
            gusts: { in: { additionalStrength: { max: 20 } } }
          }
        }
      ]
    }
    const result = merge2(config)
    expect(result.layers[0].size).toEqual({ min: 2, max: DEFAULT_SIZE_MAX })
    expect(result.layers[0].sway).toEqual({
      frequency: DEFAULT_FREQUENCY,
      amplitude: 1.5
    })
    expect(result.layers[0].wind.strength).toBe(5)
    expect(result.layers[0].wind.angle).toBe(DEFAULT_WIND_ANGLE)
    expect(result.layers[0].wind.gusts.in.additionalStrength).toEqual({
      min: DEFAULT_WIND_IN_ADDITIONAL_STRENGTH_MIN,
      max: 20
    })
  })

  it('should merge wind gusts partials with defaults', () => {
    const config: UserConfig = {
      layers: [
        {
          wind: {
            gusts: {
              active: false,
              changeChance: 0.1,
              out: { delay: { max: 15000 } },
              in: { duration: { min: 2000 } }
            }
          }
        }
      ]
    }
    const result = merge2(config)
    expect(result.layers[0].wind.gusts.active).toBe(false)
    expect(result.layers[0].wind.gusts.changeChance).toBe(0.1)
    expect(result.layers[0].wind.gusts.out.delay).toEqual({
      min: DEFAULT_WIND_OUT_DELAY_MIN,
      max: 15000
    })
    expect(result.layers[0].wind.gusts.in.duration).toEqual({
      min: 2000,
      max: DEFAULT_WIND_IN_DURATION_MAX
    })
  })

  it('should merge multiple layers with mixed types', () => {
    const imageLayer: DeepPartial<ImageLayerConfig> = {
      mode: 'image',
      image: 'flake.png'
    }
    const config: UserConfig = {
      attachTo: 'custom',
      layers: [{ colour: '#ff0000' }, imageLayer]
    }
    const result = merge2(config)
    expect(result.attachTo).toBe('custom')
    expect(result.layers.length).toBe(2)
    expect(result.layers[0]).toEqual({
      ...DEFAULT_SIMPLE_LAYER,
      colour: '#ff0000'
    })
    expect(result.layers[1]).toEqual({
      ...DEFAULT_IMAGE_LAYER,
      image: 'flake.png'
    })
  })

  it('should handle empty layer objects by filling with defaults', () => {
    const config: UserConfig = {
      layers: [{}]
    }
    const result = merge2(config)
    expect(result.layers[0]).toEqual(DEFAULT_SIMPLE_LAYER)
  })
})
