import {
  BaseConfig,
  CompleteUserConfig,
  Config,
  ImageLayerConfig,
  SimpleLayerConfig,
  UserConfig
} from './types'
import { getElementOrThrow, isSimpleLayer } from './utils'
import {
  DEFAULT_BASE_CONFIG,
  DEFAULT_CONTAINER_ID,
  DEFAULT_DENSITY,
  DEFAULT_GRAVITY,
  DEFAULT_LAYERS,
  DEFAULT_SNOW_COLOR,
  DEFAULT_SWAY,
  DEFAULT_WIND,
  DEFAULT_WIND_GUSTS_IN,
  DEFAULT_WIND_IN_ADDITIONAL_STRENGTH,
  DEFAULT_WIND_IN_DELAY,
  DEFAULT_WIND_IN_DURATION,
  DEFAULT_WIND_GUSTS_OUT,
  DEFAULT_WIND_OUT_DELAY,
  DEFAULT_WIND_OUT_DURATION,
  DEFAULT_MASS,
  DEFAULT_WIND_GUSTS,
  DEFAULT_SIMPLE_LAYER,
  DEFAULT_ROTATE,
  DEFAULT_IMAGE_LAYER,
  DEFAULT_IMAGE,
  DEFAULT_SIZE,
  DEFAULT_USER_CONFIG,
  DEFAULT_OPACITY
} from './defaults'
const simpleLayerConfig = (
  layer: Partial<SimpleLayerConfig>,
  index: number
): SimpleLayerConfig => {
  const defaultLayer =
    index < DEFAULT_LAYERS.length ? DEFAULT_LAYERS[index] : DEFAULT_SIMPLE_LAYER
  return {
    colour: layer.colour || defaultLayer.colour || DEFAULT_SNOW_COLOR,
    opacity: layer.opacity || defaultLayer.opacity || DEFAULT_OPACITY,
    density: layer.density || defaultLayer.density || DEFAULT_DENSITY,
    mode: 'simple',
    mass: { ...DEFAULT_MASS, ...defaultLayer.mass, ...layer.mass },
    size: { ...DEFAULT_SIZE, ...defaultLayer.size, ...layer.size },
    sway: { ...DEFAULT_SWAY, ...defaultLayer.sway, ...layer.sway },
    gravity: {
      ...DEFAULT_GRAVITY,
      ...defaultLayer.gravity,
      ...layer.gravity
    },
    wind: {
      ...DEFAULT_WIND,
      ...defaultLayer.wind,
      ...layer.wind,
      gusts: {
        ...DEFAULT_WIND_GUSTS,
        ...defaultLayer.wind?.gusts,
        ...layer.wind?.gusts,
        in: {
          ...DEFAULT_WIND_GUSTS_IN,
          ...defaultLayer.wind?.gusts?.in,
          ...layer.wind?.gusts?.in,
          additionalStrength: {
            ...DEFAULT_WIND_IN_ADDITIONAL_STRENGTH,
            ...defaultLayer.wind?.gusts?.in?.additionalStrength,
            ...layer.wind?.gusts?.in?.additionalStrength
          },
          duration: {
            ...DEFAULT_WIND_IN_DURATION,
            ...defaultLayer.wind?.gusts?.in?.duration,
            ...layer.wind?.gusts?.in?.duration
          },
          delay: {
            ...DEFAULT_WIND_IN_DELAY,
            ...defaultLayer.wind?.gusts?.in?.delay,
            ...layer.wind?.gusts?.in?.delay
          }
        },
        out: {
          ...DEFAULT_WIND_GUSTS_OUT,
          ...defaultLayer.wind?.gusts?.out,
          ...layer.wind?.gusts?.out,
          duration: {
            ...DEFAULT_WIND_OUT_DURATION,
            ...defaultLayer.wind?.gusts?.out?.duration,
            ...layer.wind?.gusts?.out?.duration
          },
          delay: {
            ...DEFAULT_WIND_OUT_DELAY,
            ...defaultLayer.wind?.gusts?.out?.delay,
            ...layer.wind?.gusts?.out?.delay
          }
        }
      }
    }
  }
}
const imageLayerConfig = (
  layer: Partial<ImageLayerConfig>,
  index: number
): ImageLayerConfig => {
  const defaultLayer = DEFAULT_IMAGE_LAYER
  return {
    density: layer.density || defaultLayer.density || DEFAULT_DENSITY,
    mode: 'image',
    image: layer.image || defaultLayer.image || DEFAULT_IMAGE,
    opacity: layer.opacity || defaultLayer.opacity || DEFAULT_OPACITY,
    rotate: layer.rotate || defaultLayer.rotate || DEFAULT_ROTATE,
    mass: { ...DEFAULT_MASS, ...defaultLayer.mass, ...layer.mass },
    size: { ...DEFAULT_SIZE, ...defaultLayer.size, ...layer.size },
    sway: { ...DEFAULT_SWAY, ...defaultLayer.sway, ...layer.sway },
    gravity: {
      ...DEFAULT_GRAVITY,
      ...defaultLayer.gravity,
      ...layer.gravity
    },
    wind: {
      ...DEFAULT_WIND,
      ...defaultLayer.wind,
      ...layer.wind,
      gusts: {
        ...DEFAULT_WIND_GUSTS,
        ...defaultLayer.wind?.gusts,
        ...layer.wind?.gusts,
        in: {
          ...DEFAULT_WIND_GUSTS_IN,
          ...defaultLayer.wind?.gusts?.in,
          ...layer.wind?.gusts?.in,
          additionalStrength: {
            ...DEFAULT_WIND_IN_ADDITIONAL_STRENGTH,
            ...defaultLayer.wind?.gusts?.in?.additionalStrength,
            ...layer.wind?.gusts?.in?.additionalStrength
          },
          duration: {
            ...DEFAULT_WIND_IN_DURATION,
            ...defaultLayer.wind?.gusts?.in?.duration,
            ...layer.wind?.gusts?.in?.duration
          },
          delay: {
            ...DEFAULT_WIND_IN_DELAY,
            ...defaultLayer.wind?.gusts?.in?.delay,
            ...layer.wind?.gusts?.in?.delay
          }
        },
        out: {
          ...DEFAULT_WIND_GUSTS_OUT,
          ...defaultLayer.wind?.gusts?.out,
          ...layer.wind?.gusts?.out,
          duration: {
            ...DEFAULT_WIND_OUT_DURATION,
            ...defaultLayer.wind?.gusts?.out?.duration,
            ...layer.wind?.gusts?.out?.duration
          },
          delay: {
            ...DEFAULT_WIND_OUT_DELAY,
            ...defaultLayer.wind?.gusts?.out?.delay,
            ...layer.wind?.gusts?.out?.delay
          }
        }
      }
    }
  }
}
function mergeBaseConfig(config: BaseConfig): BaseConfig {
  const result: BaseConfig = {
    ...DEFAULT_BASE_CONFIG,
    ...config,
    layers: (config.layers ?? []).map((layer, index) =>
      isSimpleLayer(layer)
        ? simpleLayerConfig(layer, index)
        : imageLayerConfig(layer, index)
    )
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
      : getElementOrThrow(DEFAULT_CONTAINER_ID)
  }
}
export function merge2(config: UserConfig): CompleteUserConfig {
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
function pruneObject(partial: any, defaultObj: any): any {
  if (!isPlainObject(partial)) return partial
  const result: any = {}
  for (const key in partial) {
    const val = partial[key]
    const defVal = defaultObj[key]
    if (val === defVal) continue
    if (Array.isArray(val)) {
      const prunedArray = pruneArray(val, defaultObj[key] || [])
      if (prunedArray.length > 0) result[key] = prunedArray
    } else if (isPlainObject(val)) {
      const pruned = pruneObject(val, defVal || {})
      if (Object.keys(pruned).length > 0) result[key] = pruned
    } else {
      result[key] = val
    }
  }
  return result
}
function pruneArray(partialArray: any[], defaultArray: any[]): any[] {
  const result: any[] = []
  for (let i = 0; i < partialArray.length; i++) {
    const partialItem = partialArray[i]
    const defaultItem = defaultArray[i] || getDefaultLayer(partialItem)
    let prunedItem = pruneObject(partialItem, defaultItem)
    if (isImageLayerPartial(partialItem) && prunedItem.mode === undefined) {
      prunedItem.mode = 'image'
    }
    result.push(prunedItem)
  }
  return tidyUp(result, defaultArray)
}
function getDefaultLayer(partialLayer: any): any {
  if (isImageLayerPartial(partialLayer)) {
    return DEFAULT_IMAGE_LAYER
  } else {
    return DEFAULT_SIMPLE_LAYER
  }
}
function isImageLayerPartial(partial: any): boolean {
  return (
    partial.mode === 'image' ||
    partial.image !== undefined ||
    partial.rotate !== undefined
  )
}
function tidyUp(layers: any[], defaultLayers: any[]) {
  return layers.filter((layer, index) => {
    if (layers.length > defaultLayers.length) {
      return true
    }
    if (Object.keys(layer).length > 0) {
      return true
    }
    // Check if there are any layers after this one that are not empty
    if (!layers.slice(index).every(obj => Object.keys(obj).length === 0)) {
      return true
    }
    return false
  })
}
export function diff(config: UserConfig): Partial<UserConfig> {
  const defaultConfig = DEFAULT_USER_CONFIG
  return pruneObject(config, defaultConfig)
}
