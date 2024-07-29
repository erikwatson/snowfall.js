import { Config, UserConfig } from './types'
import { getElementOrThrow } from './utils'
import {
  DEFAULT_CONFIG,
  DEFAULT_GRAVITY,
  DEFAULT_WAVE,
  DEFAULT_WIND
} from './defaults'

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
