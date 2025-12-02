import * as Snowfall from '../snowfall'
import * as Sim from '../simulation'

jest.mock('../simulation', () => ({
  create: jest.fn()
}))

const mockSimulation = {
  start: jest.fn(),
  stop: jest.fn(),
  setColour: jest.fn(),
  setDensity: jest.fn(),
  setAmplitude: jest.fn(),
  setFrequency: jest.fn(),
  setPaused: jest.fn(),
  togglePaused: jest.fn(),
  setWind: jest.fn(),
  setWindAngle: jest.fn(),
  setWindStrength: jest.fn(),
  setGusts: jest.fn(),
  setGravity: jest.fn(),
  setGravityAngle: jest.fn(),
  setGravityStrength: jest.fn(),
  setWindInAdditionalStrengthMin: jest.fn(),
  setWindInAdditionalStrengthMax: jest.fn(),
  setWindInDurationMin: jest.fn(),
  setWindInDurationMax: jest.fn(),
  setWindInDelayMin: jest.fn(),
  setWindInDelayMax: jest.fn(),
  setWindOutDurationMin: jest.fn(),
  setWindOutDurationMax: jest.fn(),
  setWindOutDelayMin: jest.fn(),
  setWindOutDelayMax: jest.fn(),
  setWindOutChangeChance: jest.fn(),
  setMassMin: jest.fn(),
  setMassMax: jest.fn(),
  setSizeMin: jest.fn(),
  setSizeMax: jest.fn()
}

describe('snowfall', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(Sim.create as jest.Mock).mockReturnValue(mockSimulation)
    Snowfall.stop()

    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'trace').mockImplementation(() => {})
  })

  describe('start()', () => {
    it('creates and starts a new simulation on first call', () => {
      Snowfall.start({})

      expect(Sim.create).toHaveBeenCalledTimes(1)
      expect(mockSimulation.start).toHaveBeenCalledWith({})
    })

    it('reuses existing simulation if already started', () => {
      Snowfall.start()
      Snowfall.start({ density: 200 })

      expect(Sim.create).toHaveBeenCalledTimes(1)
      expect(mockSimulation.start).toHaveBeenCalledTimes(2)
      expect(mockSimulation.start).toHaveBeenLastCalledWith({ density: 200 })
    })

    it('catches and logs errors during start', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockSimulation.start.mockImplementation(() => {
        throw new Error('Boom')
      })

      Snowfall.start()

      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error))
      consoleSpy.mockRestore()
    })
  })

  describe('restart()', () => {
    it('stops and restarts with new config', () => {
      Snowfall.start()
      jest.clearAllMocks()

      Snowfall.restart({ density: 300 })

      expect(mockSimulation.stop).toHaveBeenCalled()
      expect(Sim.create).toHaveBeenCalledTimes(1)
      expect(mockSimulation.start).toHaveBeenCalledWith({ density: 300 })
    })
  })

  describe('stop()', () => {
    it('stops the simulation and clears reference', () => {
      Snowfall.start()
      Snowfall.stop()

      expect(mockSimulation.stop).toHaveBeenCalled()
      expect(() => Snowfall.setColour('#fff', 0)).toThrow(
        'Snowfall simulation not started'
      )
    })
  })

  describe('schedule()', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    const setCurrentDate = (month: number, day: number) => {
      jest.setSystemTime(new Date(2025, month - 1, day))
    }

    it('starts simulation when current date is within the schedule', () => {
      setCurrentDate(12, 20)

      Snowfall.schedule(
        {
          from: { month: 12, day: 1 },
          to: { month: 12, day: 31 }
        },
        { density: 150 }
      )

      expect(mockSimulation.start).toHaveBeenCalledWith({ density: 150 })
    })

    it('does nothing when current date is outside the schedule', () => {
      setCurrentDate(11, 30) // November 30

      Snowfall.schedule({
        from: { month: 12, day: 1 },
        to: { month: 12, day: 31 }
      })

      expect(mockSimulation.start).not.toHaveBeenCalled()
    })

    it('supports wrap-around schedules (e.g. Nov 15 → Jan 15)', () => {
      const winterSchedule = {
        from: { month: 11, day: 15 },
        to: { month: 1, day: 15 }
      }

      setCurrentDate(12, 25) // Christmas
      Snowfall.schedule(winterSchedule)
      expect(mockSimulation.start).toHaveBeenCalled()
      jest.clearAllMocks()

      setCurrentDate(1, 10) // Jan 10
      Snowfall.schedule(winterSchedule)
      expect(mockSimulation.start).toHaveBeenCalled()
      jest.clearAllMocks()

      setCurrentDate(11, 20) // Nov 20
      Snowfall.schedule(winterSchedule)
      expect(mockSimulation.start).toHaveBeenCalled()
    })

    it('stops existing simulation before starting when entering scheduled period', () => {
      Snowfall.start() // manually start first
      jest.clearAllMocks()

      setCurrentDate(12, 5)

      Snowfall.schedule({
        from: { month: 12, day: 1 },
        to: { month: 12, day: 31 }
      })

      expect(mockSimulation.stop).toHaveBeenCalled()
      expect(mockSimulation.start).toHaveBeenCalled()
    })

    it('passes config to start() when within schedule', () => {
      setCurrentDate(12, 10)

      Snowfall.schedule(
        {
          from: { month: 12, day: 1 },
          to: { month: 12, day: 31 }
        },
        { density: 400, colour: '#ffffff' }
      )

      expect(mockSimulation.start).toHaveBeenCalledWith({
        density: 400,
        colour: '#ffffff'
      })
    })
  })

  describe('runtime methods (ensureRunning)', () => {
    const methods = [
      ['setColour', ['#ffffff', 0] as const],
      ['setDensity', [200, 0] as const],
      ['setAmplitude', [1.5, 1] as const],
      ['setFrequency', [0.5, 1] as const],
      ['setPaused', [true, 0] as const],
      ['togglePaused', [1] as const],
      ['setWind', [45, 10, 0] as const],
      ['setWindAngle', [90, 1] as const],
      ['setWindStrength', [15, 0] as const],
      ['setGusts', [true, 0] as const],
      ['setGravity', [270, 9.8, 0] as const],
      ['setGravityAngle', [180, 1] as const],
      ['setGravityStrength', [12, 0] as const],
      ['setWindInAdditionalStrengthMin', [5, 0] as const],
      ['setMassMin', [0.8, 0] as const],
      ['setSizeMax', [20, 1] as const]
      // ... rest
    ] as const

    beforeEach(() => {
      Snowfall.start()
      jest.clearAllMocks()
    })

    it.each(methods)(
      '%s delegates to simulation when running',
      (method: any, args: any) => {
        ;(Snowfall as any)[method](...args)
        expect((mockSimulation as any)[method]).toHaveBeenCalledWith(...args)
      }
    )

    it.each(methods)(
      '%s throws when simulation not started',
      (method: any, args: any) => {
        Snowfall.stop()
        expect(() => (Snowfall as any)[method](...args)).toThrow(
          'Snowfall simulation not started. Call snowfall.start() first.'
        )
      }
    )
  })
})
