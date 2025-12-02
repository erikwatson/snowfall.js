import { random } from '../math'

describe('random', () => {
  let randomSpy: jest.SpyInstance

  beforeEach(() => {
    randomSpy = jest.spyOn(Math, 'random')
  })

  afterEach(() => {
    randomSpy.mockRestore()
  })

  test('returns a number between 0 and 1 when no arguments are provided', () => {
    randomSpy.mockReturnValue(0.5)
    const result = random()
    expect(result).toBe(0.5)
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThan(1)
  })

  test('returns a number between 0 and to when only to is provided', () => {
    randomSpy.mockReturnValue(0.5)
    const result = random(10)
    expect(result).toBe(5) // 0 + 0.5 * (10 - 0) = 5
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThan(10)
  })

  test('returns a number between from and to when both are provided', () => {
    randomSpy.mockReturnValue(0.5)
    const result = random(10, 20)
    expect(result).toBe(15) // 10 + 0.5 * (20 - 10) = 15
    expect(result).toBeGreaterThanOrEqual(10)
    expect(result).toBeLessThan(20)
  })

  test('handles negative ranges correctly', () => {
    randomSpy.mockReturnValue(0.5)
    const result = random(-10, 5)
    expect(result).toBe(-2.5) // -10 + 0.5 * (5 - (-10)) = -10 + 0.5*15 = -2.5
    expect(result).toBeGreaterThanOrEqual(-10)
    expect(result).toBeLessThan(5)
  })

  test('returns from when from === to', () => {
    randomSpy.mockReturnValue(0.5) // Even if random is 0.5, since (to - from) = 0, result = from
    const result = random(7, 7)
    expect(result).toBe(7)
  })

  test('handles floating-point inputs', () => {
    randomSpy.mockReturnValue(0.5)
    const result = random(1.5, 3.5)
    expect(result).toBe(2.5) // 1.5 + 0.5 * (3.5 - 1.5) = 2.5
    expect(result).toBeGreaterThanOrEqual(1.5)
    expect(result).toBeLessThan(3.5)
  })

  test('returns values within range over multiple calls (non-deterministic check)', () => {
    // No mock here to check actual randomness, run multiple times
    for (let i = 0; i < 10; i++) {
      const result = random(0, 100)
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThan(100)
    }
  })

  test('handles invalid order (from > to) by producing values in that range', () => {
    randomSpy.mockReturnValue(0.5)
    const result = random(20, 10)
    expect(result).toBe(15) // 20 + 0.5 * (10 - 20) = 20 - 5 = 15
    expect(result).toBeGreaterThanOrEqual(10)
    expect(result).toBeLessThanOrEqual(20)
  })

  test('returns 0 for explicit undefined arguments (edge case)', () => {
    // @ts-expect-error - Testing explicit undefined which doesn't match overloads but hits implementation
    const result = random(undefined, 5)
    expect(result).toBe(0)
  })

  test('returns 0 for other invalid combinations', () => {
    // @ts-expect-error - Testing explicit undefined which doesn't match overloads but hits implementation
    const result = random(5, undefined)
    expect(result).toBe(0)
  })
})
