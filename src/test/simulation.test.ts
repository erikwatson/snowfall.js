// Mocks for dependencies
jest.mock('@erikwatson/bramble', () => ({
  game: {
    create: jest.fn(() => ({
      attachTo: jest.fn(),
      setSize: jest.fn(),
      setUpdate: jest.fn(),
      setRender: jest.fn(),
      start: jest.fn()
    }))
  }
}))
jest.mock('@tweenjs/tween.js', () => ({
  update: jest.fn()
}))
jest.mock('../config', () => ({
  merge: jest.fn()
}))
jest.mock('../math', () => ({
  seededRandom: jest.fn((min = 0, max = 1) => min)
}))
jest.mock('../layers/simple-layer', () => ({
  SimpleLayer: jest.fn(
    (
      layerConfig,
      width,
      height,
      strength,
      durationIn,
      windDelayIn,
      durationOut,
      windDelayOut,
      changeChance
    ) => ({
      mode: 'simple',
      width: width,
      height: height,
      start: jest.fn(),
      restart: jest.fn(),
      update: jest.fn(),
      render: jest.fn(),
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
    })
  )
}))
jest.mock('../layers/image-layer', () => ({
  ImageLayer: jest.fn(
    (
      layerConfig,
      width,
      height,
      strength,
      durationIn,
      windDelayIn,
      durationOut,
      windDelayOut,
      changeChance
    ) => ({
      mode: 'image',
      width: width,
      height: height,
      start: jest.fn(),
      restart: jest.fn(),
      update: jest.fn(),
      render: jest.fn(),
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
      setSizeMax: jest.fn(),
      setColour: jest.fn()
    })
  )
}))
jest.mock('../math', () => ({
  seededRandom: jest.fn()
}))
import { create } from '../simulation'
import { game } from '@erikwatson/bramble'
import * as TWEEN from '@tweenjs/tween.js'
import { merge } from '../config'
import { seededRandom } from '../math'
import { SimpleLayer } from '../layers/simple-layer'
import { ImageLayer } from '../layers/image-layer'
import { Config, UserConfig } from '../types'

describe('Simulation', () => {
  let mockConfig: Config
  let mockAttachTo: { offsetWidth: number; offsetHeight: number }

  beforeEach(() => {
    jest.clearAllMocks()
    mockAttachTo = {
      offsetWidth: 1920,
      offsetHeight: 1080
    }
    mockConfig = {
      attachTo: mockAttachTo as unknown as HTMLElement,
      layers: [
        {
          mode: 'simple',
          wind: {
            strength: 1.0,
            gusts: {
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
          }
        } as any,
        {
          mode: 'image',
          wind: {
            strength: 1.0,
            gusts: {
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
          }
        } as any
      ]
    }
    ;(merge as jest.Mock).mockReturnValue(mockConfig)
    ;(seededRandom as jest.Mock).mockImplementation((min = 0, max = 1) => min)
  })

  test('create returns a simulation object with expected methods', () => {
    const sim = create()
    expect(sim).toHaveProperty('start')
    expect(sim).toHaveProperty('restart')
    expect(sim).toHaveProperty('setColour')
    expect(sim).toHaveProperty('setDensity')
    expect(sim).toHaveProperty('setAmplitude')
    expect(sim).toHaveProperty('setFrequency')
    expect(sim).toHaveProperty('setPaused')
    expect(sim).toHaveProperty('togglePaused')
    expect(sim).toHaveProperty('setWind')
    expect(sim).toHaveProperty('setWindAngle')
    expect(sim).toHaveProperty('setWindStrength')
    expect(sim).toHaveProperty('setGusts')
    expect(sim).toHaveProperty('setGravity')
    expect(sim).toHaveProperty('setGravityAngle')
    expect(sim).toHaveProperty('setGravityStrength')
    expect(sim).toHaveProperty('setWindInAdditionalStrengthMin')
    expect(sim).toHaveProperty('setWindInAdditionalStrengthMax')
    expect(sim).toHaveProperty('setWindInDurationMin')
    expect(sim).toHaveProperty('setWindInDurationMax')
    expect(sim).toHaveProperty('setWindInDelayMin')
    expect(sim).toHaveProperty('setWindInDelayMax')
    expect(sim).toHaveProperty('setWindOutDurationMin')
    expect(sim).toHaveProperty('setWindOutDurationMax')
    expect(sim).toHaveProperty('setWindOutDelayMin')
    expect(sim).toHaveProperty('setWindOutDelayMax')
    expect(sim).toHaveProperty('setWindOutChangeChance')
    expect(sim).toHaveProperty('setMassMin')
    expect(sim).toHaveProperty('setMassMax')
    expect(sim).toHaveProperty('setSizeMin')
    expect(sim).toHaveProperty('setSizeMax')
  })

  test('start sets up config, layers, and simulation correctly', () => {
    const sim = create()
    const userConfig = {} as UserConfig

    const mockedSeededRandom = seededRandom as jest.MockedFunction<
      typeof seededRandom
    >

    // Add this block to control seededRandom returns (adjust if min/max differ per layer)
    mockedSeededRandom
      .mockReturnValueOnce(1.5) // strength for layer 0
      .mockReturnValueOnce(1000) // durationIn for layer 0
      .mockReturnValueOnce(500) // windDelayIn for layer 0
      .mockReturnValueOnce(1500) // durationOut for layer 0
      .mockReturnValueOnce(600) // windDelayOut for layer 0
      .mockReturnValueOnce(0) // changeChance for layer 0
      .mockReturnValueOnce(1.5) // strength for layer 1
      .mockReturnValueOnce(1000) // durationIn for layer 1
      .mockReturnValueOnce(500) // windDelayIn for layer 1
      .mockReturnValueOnce(1500) // durationOut for layer 1
      .mockReturnValueOnce(600) // windDelayOut for layer 1
      .mockReturnValueOnce(0) // changeChance for layer 1

    sim.start(userConfig)
    expect(merge).toHaveBeenCalledWith(userConfig)
    expect(seededRandom).toHaveBeenCalledTimes(12) // 6 per layer x 2 layers
    expect(SimpleLayer).toHaveBeenCalledWith(
      mockConfig.layers[0],
      1920,
      1080,
      1.5, // strength + min additional
      1000, // durationIn min
      500, // windDelayIn min
      1500, // durationOut min
      600, // windDelayOut min
      0 // changeChance min
    )
    expect(ImageLayer).toHaveBeenCalledWith(
      mockConfig.layers[1],
      1920,
      1080,
      1.5,
      1000,
      500,
      1500,
      600,
      0
    )
    const mockSimpleLayer = (SimpleLayer as jest.Mock).mock.results[0].value
    const mockImageLayer = (ImageLayer as jest.Mock).mock.results[0].value
    expect(mockSimpleLayer.start).toHaveBeenCalled()
    expect(mockImageLayer.start).toHaveBeenCalled()
    const mockSimulation = (game.create as jest.Mock).mock.results[0].value
    expect(mockSimulation.attachTo).toHaveBeenCalledWith(
      mockAttachTo as unknown as HTMLElement
    )
    expect(mockSimulation.setSize).toHaveBeenCalledWith(1920, 1080)
    expect(mockSimulation.setUpdate).toHaveBeenCalledWith(expect.any(Function))
    expect(mockSimulation.setRender).toHaveBeenCalledWith(expect.any(Function))
    expect(mockSimulation.start).toHaveBeenCalled()
    expect(window.onresize).toEqual(expect.any(Function))
  })

  test('update calls TWEEN.update and layer updates', () => {
    const sim = create()
    sim.start({} as UserConfig)
    const mockSimulation = (game.create as jest.Mock).mock.results[0].value
    const updateFn = mockSimulation.setUpdate.mock.calls[0][0]
    const dt = 0.016
    updateFn(dt)
    expect(TWEEN.update).toHaveBeenCalled()
    const mockSimpleLayer = (SimpleLayer as jest.Mock).mock.results[0].value
    const mockImageLayer = (ImageLayer as jest.Mock).mock.results[0].value
    expect(mockSimpleLayer.update).toHaveBeenCalledWith(dt)
    expect(mockImageLayer.update).toHaveBeenCalledWith(dt)
  })

  test('render clears and calls layer renders', () => {
    const sim = create()
    sim.start({} as UserConfig)
    const mockSimulation = (game.create as jest.Mock).mock.results[0].value
    const renderFn = mockSimulation.setRender.mock.calls[0][0]
    const mockGfx = { clear: jest.fn() } as any
    renderFn(mockGfx)
    expect(mockGfx.clear).toHaveBeenCalled()
    const mockSimpleLayer = (SimpleLayer as jest.Mock).mock.results[0].value
    const mockImageLayer = (ImageLayer as jest.Mock).mock.results[0].value
    expect(mockSimpleLayer.render).toHaveBeenCalledWith(mockGfx)
    expect(mockImageLayer.render).toHaveBeenCalledWith(mockGfx)
  })

  test('onResize updates sizes and restarts layers', () => {
    const sim = create()
    sim.start({} as UserConfig)
    const mockSimulation = (game.create as jest.Mock).mock.results[0].value
    mockAttachTo.offsetWidth = 1280
    mockAttachTo.offsetHeight = 720
    ;(window.onresize as any)()
    const mockSimpleLayer = (SimpleLayer as jest.Mock).mock.results[0].value
    const mockImageLayer = (ImageLayer as jest.Mock).mock.results[0].value
    expect(mockSimpleLayer.width).toBe(1280)
    expect(mockSimpleLayer.height).toBe(720)
    expect(mockImageLayer.width).toBe(1280)
    expect(mockImageLayer.height).toBe(720)
    expect(mockSimpleLayer.restart).toHaveBeenCalled()
    expect(mockImageLayer.restart).toHaveBeenCalled()
    expect(mockSimulation.setSize).toHaveBeenCalledWith(1280, 720)
  })

  test('restart without config restarts layers and updates size', () => {
    const sim = create()
    sim.start({} as UserConfig)
    const mockSimulation = (game.create as jest.Mock).mock.results[0].value
    const mockSimpleLayer = (SimpleLayer as jest.Mock).mock.results[0].value
    const mockImageLayer = (ImageLayer as jest.Mock).mock.results[0].value
    sim.restart()
    expect(mockSimpleLayer.restart).toHaveBeenCalled()
    expect(mockImageLayer.restart).toHaveBeenCalled()
    expect(mockSimulation.setSize).toHaveBeenCalledWith(1920, 1080)
    expect(merge).toHaveBeenCalledTimes(1) // Called in start, restart CAN merge, but only if you pass a new config
  })

  test('restart with userConfig merges new config, recreates layers, and updates', () => {
    const sim = create()
    sim.start({} as UserConfig)
    const newUserConfig = { some: 'new' } as UserConfig
    const newMockConfig = { ...mockConfig, new: true }
    ;(merge as jest.Mock).mockReturnValue(newMockConfig)
    sim.restart(newUserConfig)
    expect(merge).toHaveBeenCalledWith(newUserConfig)
    expect(SimpleLayer).toHaveBeenCalledTimes(2)
    expect(ImageLayer).toHaveBeenCalledTimes(2)
    const newMockSimpleLayer = (SimpleLayer as jest.Mock).mock.results[0].value
    const newMockImageLayer = (ImageLayer as jest.Mock).mock.results[0].value
    expect(newMockSimpleLayer.start).toHaveBeenCalled()
    expect(newMockImageLayer.start).toHaveBeenCalled()
    const mockSimulation = (game.create as jest.Mock).mock.results[0].value
    expect(mockSimulation.setSize).toHaveBeenCalledWith(1920, 1080)
  })

  test('setColour calls on simple layer, errors on image layer', () => {
    const sim = create()
    sim.start({} as UserConfig)
    const mockSimpleLayer = (SimpleLayer as jest.Mock).mock.results[0].value
    const mockImageLayer = (ImageLayer as jest.Mock).mock.results[0].value
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    sim.setColour('#fff', 0)
    expect(mockSimpleLayer.setColour).toHaveBeenCalledWith('#fff')
    sim.setColour('#fff', 1)
    expect(consoleSpy).toHaveBeenCalledWith(
      'attempting to set a colour on a layer that does not have a colour property'
    )
    expect(mockImageLayer.setColour).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  test('setter methods call through to layers', () => {
    const sim = create()
    sim.start({} as UserConfig)
    const mockSimpleLayer = (SimpleLayer as jest.Mock).mock.results[0].value
    const mockImageLayer = (ImageLayer as jest.Mock).mock.results[0].value
    sim.setDensity(100, 0)
    expect(mockSimpleLayer.setDensity).toHaveBeenCalledWith(100)
    sim.setAmplitude(2.5, 1)
    expect(mockImageLayer.setAmplitude).toHaveBeenCalledWith(2.5)
    sim.setFrequency(1.5, 0)
    expect(mockSimpleLayer.setFrequency).toHaveBeenCalledWith(1.5)
    sim.setPaused(true, 1)
    expect(mockImageLayer.setPaused).toHaveBeenCalledWith(true)
    sim.togglePaused(0)
    expect(mockSimpleLayer.togglePaused).toHaveBeenCalled()
    sim.setWind(45, 0.8, 1)
    expect(mockImageLayer.setWind).toHaveBeenCalledWith(45, 0.8)
    sim.setWindAngle(90, 0)
    expect(mockSimpleLayer.setWindAngle).toHaveBeenCalledWith(90)
    sim.setWindStrength(1.2, 1)
    expect(mockImageLayer.setWindStrength).toHaveBeenCalledWith(1.2)
    sim.setGusts(true, 0)
    expect(mockSimpleLayer.setGusts).toHaveBeenCalledWith(true)
    sim.setGravity(180, 9.8, 1)
    expect(mockImageLayer.setGravity).toHaveBeenCalledWith(180, 9.8)
    sim.setGravityAngle(270, 0)
    expect(mockSimpleLayer.setGravityAngle).toHaveBeenCalledWith(270)
    sim.setGravityStrength(10, 1)
    expect(mockImageLayer.setGravityStrength).toHaveBeenCalledWith(10)
    sim.setWindInAdditionalStrengthMin(0.3, 0)
    expect(mockSimpleLayer.setWindInAdditionalStrengthMin).toHaveBeenCalledWith(
      0.3
    )
    sim.setWindInAdditionalStrengthMax(1.0, 1)
    expect(mockImageLayer.setWindInAdditionalStrengthMax).toHaveBeenCalledWith(
      1.0
    )
    sim.setWindInDurationMin(500, 0)
    expect(mockSimpleLayer.setWindInDurationMin).toHaveBeenCalledWith(500)
    sim.setWindInDurationMax(1500, 1)
    expect(mockImageLayer.setWindInDurationMax).toHaveBeenCalledWith(1500)
    sim.setWindInDelayMin(200, 0)
    expect(mockSimpleLayer.setWindInDelayMin).toHaveBeenCalledWith(200)
    sim.setWindInDelayMax(800, 1)
    expect(mockImageLayer.setWindInDelayMax).toHaveBeenCalledWith(800)
    sim.setWindOutDurationMin(1000, 0)
    expect(mockSimpleLayer.setWindOutDurationMin).toHaveBeenCalledWith(1000)
    sim.setWindOutDurationMax(2000, 1)
    expect(mockImageLayer.setWindOutDurationMax).toHaveBeenCalledWith(2000)
    sim.setWindOutDelayMin(300, 0)
    expect(mockSimpleLayer.setWindOutDelayMin).toHaveBeenCalledWith(300)
    sim.setWindOutDelayMax(900, 1)
    expect(mockImageLayer.setWindOutDelayMax).toHaveBeenCalledWith(900)
    sim.setWindOutChangeChance(0.5, 0)
    expect(mockSimpleLayer.setWindOutChangeChance).toHaveBeenCalledWith(0.5)
    sim.setMassMin(0.1, 1)
    expect(mockImageLayer.setMassMin).toHaveBeenCalledWith(0.1)
    sim.setMassMax(5, 0)
    expect(mockSimpleLayer.setMassMax).toHaveBeenCalledWith(5)
    sim.setSizeMin(1, 1)
    expect(mockImageLayer.setSizeMin).toHaveBeenCalledWith(1)
    sim.setSizeMax(10, 0)
    expect(mockSimpleLayer.setSizeMax).toHaveBeenCalledWith(10)
  })

  test('setters on non-existent layer do nothing', () => {
    const sim = create()
    sim.start({} as UserConfig)
    expect(() => sim.setDensity(100, 99)).not.toThrow()
  })

  test('start without attachTo logs error and does not start simulation', () => {
    ;(merge as jest.Mock).mockReturnValue({ ...mockConfig, attachTo: null })
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const sim = create()
    sim.start({} as UserConfig)
    expect(consoleSpy).toHaveBeenCalledWith(
      'Unable to start the application, the specified container could not be found.'
    )
    const mockSimulation = (game.create as jest.Mock).mock.results[0].value
    expect(mockSimulation.start).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
