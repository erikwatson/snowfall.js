import { vec2 } from '@erikwatson/bramble'
import { random } from './math'
import {
  BaseLayerConfig,
  ConfigLayer,
  ImageLayerConfig,
  SimpleLayerConfig,
  UserSchedule
} from './types'

export function getElementOrThrow(id: string): HTMLElement {
  const result = document.getElementById(id)

  if (!result) {
    throw new Error(`Error: Element #${id} not found.`)
  }

  return result
}

export function withinSchedule(schedule: UserSchedule) {
  // Input validation
  const maxDaysPerMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (
    schedule.from.month < 1 ||
    schedule.from.month > 12 ||
    schedule.from.day < 1 ||
    schedule.from.day > maxDaysPerMonth[schedule.from.month] ||
    schedule.to.month < 1 ||
    schedule.to.month > 12 ||
    schedule.to.day < 1 ||
    schedule.to.day > maxDaysPerMonth[schedule.to.month]
  ) {
    throw new Error('Invalid date in schedule')
  }

  const today = new Date()
  const todayMonth = today.getUTCMonth() + 1
  const todayDay = today.getUTCDate()
  const todayMD = todayMonth * 100 + todayDay
  const fromMD = schedule.from.month * 100 + schedule.from.day
  const toMD = schedule.to.month * 100 + schedule.to.day

  let shouldStart: boolean
  if (fromMD <= toMD) {
    shouldStart = todayMD >= fromMD && todayMD <= toMD
  } else {
    shouldStart = todayMD >= fromMD || todayMD <= toMD
  }

  return shouldStart
}

// This function figures out how many snowflakes we should use for our given
// canvas size.
//
// Just setting a fixed number of snowflakes would give an uneven distribution
// of snowflakes across different screen sizes, for example.
export function requiredSnowflakes(
  width: number,
  height: number,
  density: number
) {
  const tenEightyPee = 1920 * 1080
  const thisScreen = width * height
  const snowflakeCount = Math.round(density * (thisScreen / tenEightyPee))

  return snowflakeCount
}

export function clone(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

export function makeSnowflakes(
  num: number,
  config: BaseLayerConfig | SimpleLayerConfig | ImageLayerConfig,
  width: number,
  height: number
) {
  const result = Array.from({ length: num }, () => {
    const posX = random(width)
    const posY = random(height)
    const position = vec2.create(posX, posY)

    const size =
      config.size.min + random() * (config.size.max - config.mass.min)

    return {
      position,
      // size: 3 + random() * 5,
      // size: 1 + random() * 2,
      mass: config.mass.min + random() * (config.mass.max - config.mass.min),
      size,
      renderedSize: size,
      noise: random(10), // Random value, just to add some uncertainty
      amplitude: random(config.sway.amplitude),
      frequency: random(config.sway.frequency),
      random: random(),
      rotation: random(360),
      time: 0,
      opacity: random(config.opacity.min, config.opacity.max)
    }
  })

  return result
}

export function isSimpleLayer(layer: ConfigLayer): layer is SimpleLayerConfig {
  return layer.mode === 'simple' || layer.mode === undefined
}
