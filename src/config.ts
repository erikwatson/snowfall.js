import { Config, UserConfig } from './types'
import { getElementOrThrow } from './utils'

const DEFAULT_CONTAINER = getElementOrThrow('snowfall')
const DEFAULT_BACKGROUND = '#0d0014'
const DEFAULT_PRIMARY_COLOR = '#8d90b7'
const DEFAULT_SECONDARY_COLOR = '#ffffff'
const DEFAULT_DENSITY = 200
const DEFAULT_FADE_IN = false
const DEFAULT_SCROLL = false

const DEFAULT_AMPLITUDE = 1.0
const DEFAULT_FREQUENCY = 0.02
const DEFAULT_WAVE = {
  frequency: DEFAULT_FREQUENCY,
  amplitude: DEFAULT_AMPLITUDE
}

const DEFAULT_GRAVITY_ANGLE = 90
const DEFAULT_GRAVITY_STRENGTH = 0.7
const DEFAULT_GRAVITY = {
  angle: DEFAULT_GRAVITY_ANGLE,
  strength: DEFAULT_GRAVITY_STRENGTH
}

const DEFAULT_WIND_ANGLE = 0
const DEFAULT_WIND_STRENGTH = 0
const DEFAULT_WIND = {
  angle: DEFAULT_WIND_ANGLE,
  strength: DEFAULT_WIND_STRENGTH
}

const DEFAULT_CONFIG: Config = {
  attachTo: DEFAULT_CONTAINER,
  background: DEFAULT_BACKGROUND,
  primary: DEFAULT_PRIMARY_COLOR,
  secondary: DEFAULT_SECONDARY_COLOR,
  density: DEFAULT_DENSITY,
  fadeIn: DEFAULT_FADE_IN,
  scroll: DEFAULT_SCROLL,
  wave: DEFAULT_WAVE,
  gravity: DEFAULT_GRAVITY,
  wind: DEFAULT_WIND
}

export function merge(config: UserConfig): Config {
  const result: Config = {
    ...DEFAULT_CONFIG,
    ...config,
    wave: { ...DEFAULT_WAVE, ...config.wave },
    gravity: { ...DEFAULT_GRAVITY, ...config.gravity },
    wind: { ...DEFAULT_WIND, ...config.wind }
  }

  if (config.attachTo) {
    result.attachTo = getElementOrThrow(config.attachTo)
  }

  return result
}
