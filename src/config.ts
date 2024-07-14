import { Config, UserConfig } from './types'
import { getElementOrThrow } from './utils'

const DEFAULT_CONTAINER = getElementOrThrow('snowfall')
const DEFAULT_BACKGROUND = '#0d0014'
const DEFAULT_PRIMARY_COLOR = '#8d90b7'
const DEFAULT_SECONDARY_COLOR = '#ffffff'
const DEFAULT_DENSITY = 200
const DEFAULT_FADE_IN = false

const DEFAULT_AMPLITUDE = 1.0
const DEFAULT_FREQUENCY = 0.02
const DEFAULT_WAVE = {
  frequency: DEFAULT_FREQUENCY,
  amplitude: DEFAULT_AMPLITUDE
}

const DEFAULT_GRAVITY_ANGLE = 90
const DEFAULT_GRAVITY_STRENGTH = 0.7
const DEFAULT_RESPECT_ORIENTATION = false
const DEFAULT_GRAVITY = {
  angle: DEFAULT_GRAVITY_ANGLE,
  strength: DEFAULT_GRAVITY_STRENGTH,
  respectOrientation: DEFAULT_RESPECT_ORIENTATION
}

const DEFAULT_WIND_ANGLE = 0
const DEFAULT_WIND_STRENGTH = 0
const DEFAULT_WIND_GUSTS = true
const DEFAULT_WIND_IN_ADDITIONAL_STRENGTH_MIN = 1
const DEFAULT_WIND_IN_ADDITIONAL_STRENGTH_MAX = 3
const DEFAULT_WIND_IN_DURATION_MIN = 1000
const DEFAULT_WIND_IN_DURATION_MAX = 3000
const DEFAULT_WIND_IN_DELAY_MIN = 1000
const DEFAULT_WIND_IN_DELAY_MAX = 10000
const DEFAULT_WIND_OUT_DELAY_MIN = 5000
const DEFAULT_WIND_OUT_DURATION_MAX = 10000
const DEFAULT_WIND_OUT_DURATION_MIN = 1000
const DEFAULT_WIND_OUT_DELAY_MAX = 10000
const DEFAULT_WIND = {
  angle: DEFAULT_WIND_ANGLE,
  strength: DEFAULT_WIND_STRENGTH,
  gusts: DEFAULT_WIND_GUSTS,
  in: {
    additionalStrength: {
      min: DEFAULT_WIND_IN_ADDITIONAL_STRENGTH_MAX,
      max: DEFAULT_WIND_IN_ADDITIONAL_STRENGTH_MIN
    },
    duration: {
      min: DEFAULT_WIND_IN_DURATION_MIN,
      max: DEFAULT_WIND_IN_DURATION_MAX
    },
    delay: {
      min: DEFAULT_WIND_IN_DELAY_MIN,
      max: DEFAULT_WIND_IN_DELAY_MAX
    }
  },
  out: {
    duration: {
      min: DEFAULT_WIND_OUT_DURATION_MIN,
      max: DEFAULT_WIND_OUT_DURATION_MAX
    },
    delay: {
      min: DEFAULT_WIND_OUT_DELAY_MIN,
      max: DEFAULT_WIND_OUT_DELAY_MAX
    }
  }
}

const DEFAULT_CONFIG: Config = {
  attachTo: DEFAULT_CONTAINER,
  background: DEFAULT_BACKGROUND,
  primary: DEFAULT_PRIMARY_COLOR,
  secondary: DEFAULT_SECONDARY_COLOR,
  density: DEFAULT_DENSITY,
  fadeIn: DEFAULT_FADE_IN,
  wave: DEFAULT_WAVE,
  gravity: DEFAULT_GRAVITY,
  wind: DEFAULT_WIND
}

export function merge(config: UserConfig): Config {
  const { attachTo, ...configWithoutAttachTo } = config

  const result: Config = {
    ...DEFAULT_CONFIG,
    ...configWithoutAttachTo,
    wave: { ...DEFAULT_WAVE, ...config.wave },
    gravity: { ...DEFAULT_GRAVITY, ...config.gravity },
    wind: { ...DEFAULT_WIND, ...config.wind }
  }

  if (config.attachTo) {
    result.attachTo = getElementOrThrow(config.attachTo)
  }

  return result
}
