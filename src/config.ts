import { BaseConfig, Config, ConfigLayer, UserConfig } from './types'
import { getElementOrThrow } from './utils'
import {
  DEFAULT_BASE_CONFIG,
  DEFAULT_CONTAINER,
  DEFAULT_CONTAINER_ID,
  DEFAULT_DENSITY,
  DEFAULT_FADE_IN,
  DEFAULT_GRAVITY,
  DEFAULT_LAYERS,
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_WAVE,
  DEFAULT_WIND,
  DEFAULT_WIND_IN,
  DEFAULT_WIND_IN_ADDITIONAL_STRENGTH,
  DEFAULT_WIND_IN_DELAY,
  DEFAULT_WIND_IN_DURATION,
  DEFAULT_WIND_OUT,
  DEFAULT_WIND_OUT_DELAY,
  DEFAULT_WIND_OUT_DURATION
} from './defaults'

function mergeBaseConfig(config: BaseConfig): BaseConfig {
  const layerConfig = (config: ConfigLayer) => {
    return {
      colour: config.colour || DEFAULT_PRIMARY_COLOR,
      density: config.density || DEFAULT_DENSITY,
      fadeIn: config.fadeIn || DEFAULT_FADE_IN,
      wave: { ...DEFAULT_WAVE, ...config.wave },
      gravity: { ...DEFAULT_GRAVITY, ...config.gravity },
      wind: {
        ...DEFAULT_WIND,
        ...config.wind,
        in: {
          ...DEFAULT_WIND_IN,
          ...config.wind?.in,
          additionalStrength: {
            ...DEFAULT_WIND_IN_ADDITIONAL_STRENGTH,
            ...config.wind?.in?.additionalStrength
          },
          duration: {
            ...DEFAULT_WIND_IN_DURATION,
            ...config.wind?.in?.duration
          },
          delay: {
            ...DEFAULT_WIND_IN_DELAY,
            ...config.wind?.in?.delay
          }
        },
        out: {
          ...DEFAULT_WIND_OUT,
          ...config.wind?.out,
          duration: {
            ...DEFAULT_WIND_OUT_DURATION,
            ...config.wind?.out?.duration
          },
          delay: {
            ...DEFAULT_WIND_OUT_DELAY,
            ...config.wind?.out?.delay
          }
        }
      }
    }
  }

  const result: BaseConfig = {
    ...DEFAULT_BASE_CONFIG,
    ...config,
    layers: (config.layers ?? DEFAULT_LAYERS).map(layerConfig)
  }

  return result
}

export function merge(config: UserConfig): Config {
  const { attachTo, ...baseConfig } = config
  const basedConfig = mergeBaseConfig(baseConfig as BaseConfig)

  return {
    ...basedConfig,
    attachTo: config.attachTo
      ? getElementOrThrow(config.attachTo)
      : DEFAULT_CONTAINER
  }
}

export function merge2(config: UserConfig): UserConfig {
  const { attachTo, ...baseConfig } = config
  const basedConfig = mergeBaseConfig(baseConfig as BaseConfig)

  return {
    ...basedConfig,
    attachTo: config.attachTo ?? DEFAULT_CONTAINER_ID
  }
}

function isPlainObject(obj: any): obj is Record<string, any> {
  return obj !== null && typeof obj === 'object' && obj.constructor === Object
}

function isHTMLElement(obj: any): obj is HTMLElement {
  return obj instanceof HTMLElement
}

function diffObjects(defaultObj: any, userObj: any, seen = new WeakMap()): any {
  if (seen.has(userObj)) {
    return {} // Handle circular references
  }
  seen.set(userObj, true)

  const result: any = {}

  for (const key in userObj) {
    try {
      if (isPlainObject(userObj[key]) && isPlainObject(defaultObj[key])) {
        const nestedDiff = diffObjects(defaultObj[key], userObj[key], seen)
        if (Object.keys(nestedDiff).length > 0) {
          result[key] = nestedDiff
        }
      } else if (
        isHTMLElement(userObj[key]) &&
        isHTMLElement(defaultObj[key])
      ) {
        if (userObj[key] !== defaultObj[key]) {
          result[key] = userObj[key]
        }
      } else if (userObj[key] !== defaultObj[key]) {
        result[key] = userObj[key]
      }
    } catch (error) {
      // Skip keys that cause errors
      console.error(`Failed to access property ${key}:`, error)
    }
  }

  seen.delete(userObj)
  return result
}

export function diff(config: UserConfig): Partial<Config> {
  const defaultConfig = merge2({})
  const userConfig = merge2(config)

  return diffObjects(defaultConfig, userConfig)
}
