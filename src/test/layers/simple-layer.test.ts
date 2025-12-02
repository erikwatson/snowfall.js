import { Graphics, vec2 } from '@erikwatson/bramble'
import { SimpleLayer } from '../../layers/simple-layer'
import { SimpleLayerConfig, Snowflake } from '../../types'

describe('SimpleLayer', () => {
  let config: SimpleLayerConfig
  let layer: SimpleLayer
  let mockGfx: jest.Mocked<Graphics>

  beforeEach(() => {
    config = {
      mode: 'simple',
      colour: '#FFFFFF',
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
    layer = new SimpleLayer(config, 1920, 1080, 1.5, 1000, 500, 1500, 600, 0)
    mockGfx = { circle: jest.fn() } as unknown as jest.Mocked<Graphics>
  })

  test('constructor initializes correctly', () => {
    expect(layer.mode).toBe('simple')
    expect(layer.config).toEqual(config)
    expect(layer.width).toBe(1920)
    expect(layer.height).toBe(1080)
  })

  test('render draws circles for each snowflake', () => {
    // Manually set snowflakes for test, using full Snowflake type
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
        rotation: 0,
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
        rotation: 0,
        opacity: 0.5
      }
    ] // Cast to match type (assuming velocity/rotationSpeed added elsewhere)
    layer.render(mockGfx)
    expect(mockGfx.circle).toHaveBeenCalledTimes(2)
    expect(mockGfx.circle).toHaveBeenCalledWith(
      layer.snowflakes[0].position,
      5,
      {
        fill: { colour: '#FFFFFF', opacity: 1 },
        line: { width: 0 }
      }
    )
    expect(mockGfx.circle).toHaveBeenCalledWith(
      layer.snowflakes[1].position,
      10,
      {
        fill: { colour: '#FFFFFF', opacity: 0.5 },
        line: { width: 0 }
      }
    )
  })

  test('setColour throws not implemented error', () => {
    expect(() => layer.setColour('#000000')).toThrow('Method not implemented.')
  })
})
