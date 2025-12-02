import { Graphics, vec2 } from '@erikwatson/bramble'
import { ImageLayer } from '../../layers/image-layer'
import { ImageLayerConfig, Snowflake } from '../../types'

describe('ImageLayer', () => {
  let config: ImageLayerConfig
  let layer: ImageLayer
  let mockGfx: jest.Mocked<Graphics>

  beforeEach(() => {
    config = {
      mode: 'image',
      image: 'http://localhost/assets/snowflake.png',
      rotate: true,
      opacity: { min: 0, max: 1 },
      density: 100,
      sway: { amplitude: 1, frequency: 0.5 },
      wind: {
        angle: 0,
        strength: 1,
        gusts: {
          active: false,
          changeChance: 0,
          in: {
            additionalStrength: { min: 0, max: 0 },
            duration: { min: 0, max: 0 },
            delay: { min: 0, max: 0 }
          },
          out: { duration: { min: 0, max: 0 }, delay: { min: 0, max: 0 } }
        }
      },
      gravity: { angle: 90, strength: 9.8 },
      mass: { min: 1, max: 5 },
      size: { min: 2, max: 4 }
    }
    layer = new ImageLayer(config, 1920, 1080, 1.5, 1000, 500, 1500, 600, 0)
    mockGfx = {
      image: jest.fn(),
      rotation: jest.fn()
    } as unknown as jest.Mocked<Graphics>
  })

  test('constructor initializes correctly', () => {
    expect(layer.mode).toBe('image')
    expect(layer.config).toEqual(config)
    expect(layer.width).toBe(1920)
    expect(layer.height).toBe(1080)
    expect(layer.image.src).toBe(config.image)
  })

  test('render draws images with rotation for each snowflake', () => {
    // Manually set snowflakes for test
    layer.snowflakes = [
      {
        position: vec2.create(100, 100),
        mass: 3,
        size: 5,
        renderedSize: 5,
        noise: 0.5,
        time: 0,
        amplitude: 1,
        frequency: 0.5,
        random: 0.2,
        rotation: 45,
        opacity: 1
      },
      {
        position: vec2.create(200, 200),
        mass: 4,
        size: 10,
        renderedSize: 10,
        noise: 0.6,
        time: 0,
        amplitude: 1,
        frequency: 0.5,
        random: 0.3,
        rotation: 90,
        opacity: 0.5
      }
    ]
    layer.render(mockGfx)
    expect(mockGfx.rotation).toHaveBeenCalledTimes(2)

    // Invoke the first rotation callback
    const firstCallback = mockGfx.rotation.mock.calls[0][0]
    firstCallback()

    // Invoke the second rotation callback
    const secondCallback = mockGfx.rotation.mock.calls[1][0]
    secondCallback()

    expect(mockGfx.image).toHaveBeenCalledTimes(2)
    expect(mockGfx.image).toHaveBeenCalledWith(
      layer.image,
      { x: 100 - 2.5, y: 100 - 2.5 },
      { width: 5, height: 5 }
    )
    expect(mockGfx.image).toHaveBeenCalledWith(
      layer.image,
      { x: 200 - 5, y: 200 - 5 },
      { width: 10, height: 10 }
    )
  })

  test('render draws images without rotation when rotate is false', () => {
    config.rotate = false
    layer = new ImageLayer(config, 1920, 1080, 1.5, 1000, 500, 1500, 600, 0)
    layer.snowflakes = [
      {
        position: vec2.create(100, 100),
        mass: 3,
        size: 5,
        renderedSize: 5,
        noise: 0.5,
        time: 0,
        amplitude: 1,
        frequency: 0.5,
        random: 0.2,
        rotation: 45,
        opacity: 1
      }
    ]
    layer.render(mockGfx)
    expect(mockGfx.rotation).not.toHaveBeenCalled()
    expect(mockGfx.image).toHaveBeenCalledTimes(1)
    expect(mockGfx.image).toHaveBeenCalledWith(
      layer.image,
      { x: 100 - 2.5, y: 100 - 2.5 }, // offset = size / 2 = 2.5
      { width: 5, height: 5 }
    )
  })

  test('setImage throws not implemented error', () => {
    expect(() => layer.setImage('new-image.png')).toThrow(
      'Method not implemented.'
    )
  })
})
