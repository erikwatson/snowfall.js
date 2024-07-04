import { Config, UserConfig } from './types'

const DEFAULT_BACKGROUND = '#0d0014'
const DEFAULT_PRIMARY_COLOR = '#8d90b7'
const DEFAULT_SECONDARY_COLOR = '#ffffff'
const DEFAULT_DENSITY = 200
const DEFAULT_FADE_IN = false
const DEFAULT_SCROLL = false
const DEFAULT_AMPLITUDE = 1.0
const DEFAULT_FREQUENCY = 0.02

const DEFAULT_GRAVITY_ANGLE = 90
const DEFAULT_GRAVITY_STRENGTH = 0.7

const DEFAULT_WIND_ANGLE = 0
const DEFAULT_WIND_STRENGTH = 0

const DEFAULT_CONFIG: Config = {
  attachTo: document.getElementById('snowfall'),
  background: DEFAULT_BACKGROUND,
  primary: DEFAULT_PRIMARY_COLOR,
  secondary: DEFAULT_SECONDARY_COLOR,
  density: DEFAULT_DENSITY,
  fadeIn: DEFAULT_FADE_IN,
  scroll: DEFAULT_SCROLL,
  wave: { frequency: DEFAULT_FREQUENCY, amplitude: DEFAULT_AMPLITUDE },
  gravity: { angle: DEFAULT_GRAVITY_ANGLE, strength: DEFAULT_GRAVITY_STRENGTH },
  wind: { angle: DEFAULT_WIND_ANGLE, strength: DEFAULT_WIND_STRENGTH }
}

export function merge(config: UserConfig) {
  return {
    ...DEFAULT_CONFIG,
    ...config,
    wave: { ...DEFAULT_CONFIG.wave, ...config.wave },
    gravity: { ...DEFAULT_CONFIG.gravity, ...config.gravity },
    wind: { ...DEFAULT_CONFIG.wind, ...config.wind }
  }
}
