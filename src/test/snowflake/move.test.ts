// src/test/snowflake/move.test.ts
import { vec2 } from '@erikwatson/bramble'
import { lerp } from '../../math'
import { Snowflake } from '../../types'
import * as move from '../../snowflake/move'

jest.mock('../../math', () => {
  const actual = jest.requireActual('../../math')
  return {
    ...actual,
    random: jest.fn()
  }
})

const mockRandom = jest.mocked(require('../../math').random)

function createSnowflake(overrides?: Partial<Snowflake>): Snowflake {
  return {
    position: vec2.create(100, 100),
    rotation: 0,
    renderedSize: 5,
    size: 10,
    mass: 1,
    random: 0.3,
    noise: 0.7,
    time: 0,
    ...overrides
  } as Snowflake
}

describe('snowflake/move', () => {
  beforeEach(() => {
    mockRandom.mockReset()
  })

  it('addWind applies scaled wind vector', () => {
    const s = createSnowflake()
    move.addWind(s, 0, 10)
    expect(s.position.x).toBeCloseTo(113)
    expect(s.position.y).toBeCloseTo(100)
  })

  it('addGravity applies scaled gravity vector', () => {
    const s = createSnowflake()
    move.addGravity(s, 90, 15)
    expect(s.position.y).toBeCloseTo(119.5)
    expect(s.position.x).toBeCloseTo(100)
  })

  it('addRotation increments rotation', () => {
    const s = createSnowflake({ rotation: 10 })
    move.addRotation(s)
    expect(s.rotation).toBe(11)
  })

  it('addSwayMotion applies perpendicular sine offset', () => {
    const s = createSnowflake({ time: 0, noise: Math.PI / 2 })
    const orig = vec2.clone(s.position)

    move.addSwayMotion(
      s,
      { angle: 90, strength: 1 },
      { frequency: 1, amplitude: 20 }
    )

    // With gravity = 90° (down), perpendicular is left/right → x changes
    expect(Math.abs(s.position.x - orig.x)).toBeCloseTo(20, 0)
    expect(s.position.y).toBeCloseTo(orig.y)
  })

  it('fadeIn lerps when < mass', () => {
    const s = createSnowflake({ renderedSize: 0, mass: 10 })
    move.fadeIn(s)
    expect(s.renderedSize).toBeCloseTo(0.25)
  })

  it('fadeIn does nothing when >= mass', () => {
    const s = createSnowflake({ renderedSize: 10, mass: 10 })
    move.fadeIn(s)
    expect(s.renderedSize).toBe(10)
  })
})
