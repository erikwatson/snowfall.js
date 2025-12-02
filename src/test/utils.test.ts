import { withinSchedule } from '../utils'
import { UserSchedule } from '../types'

const mockDate = (isoString: string) => {
  const originalDate = Date
  const mockedDate = new Date(isoString)
  global.Date = jest.fn((...args) => {
    if (args.length === 0) return mockedDate
    return new (originalDate as any)(...args)
  }) as any
  global.Date.now = () => mockedDate.getTime()
  global.Date.parse = originalDate.parse
  global.Date.UTC = originalDate.UTC
  return () => {
    global.Date = originalDate
  }
}

describe('withinSchedule', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('returns true when today is within same-year schedule', () => {
    const restore = mockDate('2025-06-15T12:00:00Z')
    const schedule: UserSchedule = {
      from: { month: 6, day: 1 },
      to: { month: 6, day: 30 }
    }
    expect(withinSchedule(schedule)).toBe(true)
    restore()
  })

  test('returns true on exact start date', () => {
    const restore = mockDate('2025-03-01T00:00:00Z')
    const schedule: UserSchedule = {
      from: { month: 3, day: 1 },
      to: { month: 3, day: 31 }
    }
    expect(withinSchedule(schedule)).toBe(true)
    restore()
  })

  test('returns true on exact end date (even at 23:59:59)', () => {
    const restore = mockDate('2025-03-31T23:59:59Z')
    const schedule: UserSchedule = {
      from: { month: 3, day: 1 },
      to: { month: 3, day: 31 }
    }
    expect(withinSchedule(schedule)).toBe(true)
    restore()
  })

  test('returns false when today is before start', () => {
    const restore = mockDate('2025-05-31T12:00:00Z')
    const schedule: UserSchedule = {
      from: { month: 6, day: 1 },
      to: { month: 6, day: 30 }
    }
    expect(withinSchedule(schedule)).toBe(false)
    restore()
  })

  test('returns false when today is after end', () => {
    const restore = mockDate('2025-07-01T12:00:00Z')
    const schedule: UserSchedule = {
      from: { month: 6, day: 1 },
      to: { month: 6, day: 30 }
    }
    expect(withinSchedule(schedule)).toBe(false)
    restore()
  })

  test('handles schedules that span new year (Dec to Jan) when today is in December', () => {
    const restore = mockDate('2025-12-30T12:00:00Z')
    const schedule: UserSchedule = {
      from: { month: 12, day: 25 },
      to: { month: 1, day: 5 }
    }
    expect(withinSchedule(schedule)).toBe(true)
    restore()
  })

  test('handles new year span correctly when today is in January', () => {
    const restore = mockDate('2026-01-03T12:00:00Z')
    const schedule: UserSchedule = {
      from: { month: 12, day: 25 },
      to: { month: 1, day: 5 }
    }
    expect(withinSchedule(schedule)).toBe(true)
    restore()
  })

  test('returns false for new year span when today is too early (before Dec 25)', () => {
    const restore = mockDate('2025-12-24T12:00:00Z')
    const schedule: UserSchedule = {
      from: { month: 12, day: 25 },
      to: { month: 1, day: 5 }
    }
    expect(withinSchedule(schedule)).toBe(false)
    restore()
  })

  test('returns false for new year span when today is too late (after Jan 5)', () => {
    const restore = mockDate('2026-01-06T12:00:00Z')
    const schedule: UserSchedule = {
      from: { month: 12, day: 25 },
      to: { month: 1, day: 5 }
    }
    expect(withinSchedule(schedule)).toBe(false)
    restore()
  })

  test('handles February 29 correctly in leap year', () => {
    const restore = mockDate('2024-02-29T12:00:00Z')
    const schedule: UserSchedule = {
      from: { month: 2, day: 29 },
      to: { month: 3, day: 1 }
    }
    expect(withinSchedule(schedule)).toBe(true)
    restore()
  })

  test('handles February 29 in non-leap year (rolls over to March 1)', () => {
    const restore = mockDate('2025-02-28T12:00:00Z')
    const schedule: UserSchedule = {
      from: { month: 2, day: 29 },
      to: { month: 3, day: 1 }
    }
    expect(() => withinSchedule(schedule)).not.toThrow() // Allow rollover
    expect(withinSchedule(schedule)).toBe(false) // Feb 28 < March 1
    restore()
  })

  test('throws on invalid month', () => {
    const invalidSchedule = {
      from: { month: 13, day: 1 },
      to: { month: 1, day: 1 }
    } as any
    expect(() => withinSchedule(invalidSchedule)).toThrow(
      'Invalid date in schedule'
    )
  })

  test('throws on invalid day (e.g. June 31)', () => {
    const invalidSchedule = {
      from: { month: 6, day: 31 },
      to: { month: 6, day: 1 }
    } as any
    expect(() => withinSchedule(invalidSchedule)).toThrow(
      'Invalid date in schedule'
    )
  })

  test('throws on day 0', () => {
    const invalidSchedule = {
      from: { month: 6, day: 0 },
      to: { month: 6, day: 1 }
    } as any
    expect(() => withinSchedule(invalidSchedule)).toThrow(
      'Invalid date in schedule'
    )
  })

  test('throws on day 32', () => {
    const invalidSchedule = {
      from: { month: 6, day: 32 },
      to: { month: 6, day: 1 }
    } as any
    expect(() => withinSchedule(invalidSchedule)).toThrow(
      'Invalid date in schedule'
    )
  })

  test('returns true for same-day schedule on that day', () => {
    const restore = mockDate('2025-06-01T12:00:00Z')
    const schedule: UserSchedule = {
      from: { month: 6, day: 1 },
      to: { month: 6, day: 1 }
    }
    expect(withinSchedule(schedule)).toBe(true)
    restore()
  })

  test('returns false for same-day schedule before the day', () => {
    const restore = mockDate('2025-05-31T12:00:00Z')
    const schedule: UserSchedule = {
      from: { month: 6, day: 1 },
      to: { month: 6, day: 1 }
    }
    expect(withinSchedule(schedule)).toBe(false)
    restore()
  })

  test('returns false for same-day schedule after the day', () => {
    const restore = mockDate('2025-06-02T12:00:00Z')
    const schedule: UserSchedule = {
      from: { month: 6, day: 1 },
      to: { month: 6, day: 1 }
    }
    expect(withinSchedule(schedule)).toBe(false)
    restore()
  })

  test('returns true for multi-month span without wrap-around (inside range)', () => {
    const restore = mockDate('2025-04-20T12:00:00Z')
    const schedule: UserSchedule = {
      from: { month: 3, day: 15 },
      to: { month: 5, day: 10 }
    }
    expect(withinSchedule(schedule)).toBe(true)
    restore()
  })

  test('returns false for multi-month span without wrap-around (before range)', () => {
    const restore = mockDate('2025-03-14T12:00:00Z')
    const schedule: UserSchedule = {
      from: { month: 3, day: 15 },
      to: { month: 5, day: 10 }
    }
    expect(withinSchedule(schedule)).toBe(false)
    restore()
  })

  test('returns false for multi-month span without wrap-around (after range)', () => {
    const restore = mockDate('2025-05-11T12:00:00Z')
    const schedule: UserSchedule = {
      from: { month: 3, day: 15 },
      to: { month: 5, day: 10 }
    }
    expect(withinSchedule(schedule)).toBe(false)
    restore()
  })

  test('returns true for larger wrap-around span (inside fall/winter)', () => {
    const restore = mockDate('2025-11-15T12:00:00Z') // November
    const schedule: UserSchedule = {
      from: { month: 9, day: 1 },
      to: { month: 2, day: 28 }
    }
    expect(withinSchedule(schedule)).toBe(true)
    restore()
  })

  test('returns true for larger wrap-around span (inside winter next year)', () => {
    const restore = mockDate('2026-01-10T12:00:00Z') // January next year
    const schedule: UserSchedule = {
      from: { month: 9, day: 1 },
      to: { month: 2, day: 28 }
    }
    expect(withinSchedule(schedule)).toBe(true)
    restore()
  })

  test('returns false for larger wrap-around span (before range)', () => {
    const restore = mockDate('2025-08-31T12:00:00Z')
    const schedule: UserSchedule = {
      from: { month: 9, day: 1 },
      to: { month: 2, day: 28 }
    }
    expect(withinSchedule(schedule)).toBe(false)
    restore()
  })

  test('returns false for larger wrap-around span (after range)', () => {
    const restore = mockDate('2026-03-01T12:00:00Z')
    const schedule: UserSchedule = {
      from: { month: 9, day: 1 },
      to: { month: 2, day: 28 }
    }
    expect(withinSchedule(schedule)).toBe(false)
    restore()
  })

  test('handles inverted days in same month as wrap-around (true in "after" part)', () => {
    const restore = mockDate('2025-06-25T12:00:00Z') // June 25 > June 20, but treated as wrap-around (June 20-Dec 31 or Jan 1-June 10)
    const schedule: UserSchedule = {
      from: { month: 6, day: 20 },
      to: { month: 6, day: 10 }
    }
    expect(withinSchedule(schedule)).toBe(true)
    restore()
  })

  test('handles inverted days in same month as wrap-around (true in "before" part next year)', () => {
    const restore = mockDate('2026-01-05T12:00:00Z') // January 5 < June 10
    const schedule: UserSchedule = {
      from: { month: 6, day: 20 },
      to: { month: 6, day: 10 }
    }
    expect(withinSchedule(schedule)).toBe(true)
    restore()
  })

  test('handles inverted days in same month as wrap-around (false in gap)', () => {
    const restore = mockDate('2025-06-15T12:00:00Z') // June 15 between 10 and 20
    const schedule: UserSchedule = {
      from: { month: 6, day: 20 },
      to: { month: 6, day: 10 }
    }
    expect(withinSchedule(schedule)).toBe(false)
    restore()
  })

  test('throws on invalid day (February 30)', () => {
    const invalidSchedule = {
      from: { month: 2, day: 30 },
      to: { month: 2, day: 1 }
    } as any
    expect(() => withinSchedule(invalidSchedule)).toThrow(
      'Invalid date in schedule'
    )
  })

  test('throws on invalid day (April 31)', () => {
    const invalidSchedule = {
      from: { month: 4, day: 31 },
      to: { month: 4, day: 1 }
    } as any
    expect(() => withinSchedule(invalidSchedule)).toThrow(
      'Invalid date in schedule'
    )
  })

  test('throws on invalid month (month 0)', () => {
    const invalidSchedule = {
      from: { month: 0, day: 1 },
      to: { month: 1, day: 1 }
    } as any
    expect(() => withinSchedule(invalidSchedule)).toThrow(
      'Invalid date in schedule'
    )
  })

  test('returns true for leap year start to non-leap rollover (on March 1 in non-leap year)', () => {
    const restore = mockDate('2025-03-01T12:00:00Z') // 2025 non-leap, March 1 >= effective Feb 29 rollover
    const schedule: UserSchedule = {
      from: { month: 2, day: 29 },
      to: { month: 3, day: 1 }
    }
    expect(withinSchedule(schedule)).toBe(true)
    restore()
  })
})
